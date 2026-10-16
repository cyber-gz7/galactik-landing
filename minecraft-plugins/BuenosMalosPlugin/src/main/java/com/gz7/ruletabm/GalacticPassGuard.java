package com.gz7.ruletabm;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Instant;

public final class GalacticPassGuard {

    private static final int[] SHARD_A = {
        0x47 ^ 0xA5, 0x5A ^ 0xA5, 0x37 ^ 0xA5, 0x5F ^ 0xA5,
        0x4D ^ 0xA5, 0x41 ^ 0xA5, 0x53 ^ 0xA5, 0x54 ^ 0xA5,
        0x45 ^ 0xA5, 0x52 ^ 0xA5, 0x5F ^ 0xA5, 0x32 ^ 0xA5,
        0x30 ^ 0xA5, 0x32 ^ 0xA5, 0x36 ^ 0xA5, 0x21 ^ 0xA5
    };

    private static final int[] SHARD_B = {
        0x43 ^ 0x5A, 0x4A ^ 0x5A, 0x37 ^ 0x5A, 0x54 ^ 0x5A,
        0x45 ^ 0xA5 ^ 0xFF, 0x43 ^ 0x5A, 0x5F ^ 0x5A, 0x53 ^ 0x5A,
        0x45 ^ 0x5A, 0x43 ^ 0x5A, 0x5F ^ 0x5A, 0x4B ^ 0x5A,
        0x45 ^ 0x5A, 0x59 ^ 0x5A, 0x39 ^ 0x5A, 0x39 ^ 0x5A
    };

    private static volatile long authorizedUntilEpochSecs = 0L;
    private static volatile String authorizedStreamer = "";

    private GalacticPassGuard() {}

    private static byte[] reconstructSecret() {
        byte[] out = new byte[32];
        for (int i = 0; i < 16; i++) {
            out[i] = (byte) (SHARD_A[i] ^ 0xA5);
        }
        int[] rawB = {
            0x43 ^ 0x5A, 0x4A ^ 0x5A, 0x37 ^ 0x5A, 0x54 ^ 0x5A,
            0x45 ^ 0x5A, 0x43 ^ 0x5A, 0x5F ^ 0x5A, 0x53 ^ 0x5A,
            0x45 ^ 0x5A, 0x43 ^ 0x5A, 0x5F ^ 0x5A, 0x4B ^ 0x5A,
            0x45 ^ 0x5A, 0x59 ^ 0x5A, 0x39 ^ 0x5A, 0x39 ^ 0x5A
        };
        for (int i = 0; i < 16; i++) {
            out[16 + i] = (byte) (rawB[i] ^ 0x5A);
        }
        return out;
    }

    public static boolean verifyAndActivateToken(String token) {
        if (token == null || !token.startsWith("gz7pase-v1:")) {
            return false;
        }
        String[] parts = token.trim().split(":");
        if (parts.length != 5) {
            return false;
        }
        String username = parts[1];
        String serverId = parts[2];
        long issuedAt;
        try {
            issuedAt = Long.parseLong(parts[3]);
        } catch (NumberFormatException e) {
            return false;
        }
        String providedHexSig = parts[4];
        long now = Instant.now().getEpochSecond();
        if (Math.abs(now - issuedAt) > 86400L) {
            return false;
        }

        String body = "gz7pase-v1:" + username + ":" + serverId + ":" + issuedAt;
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(reconstructSecret(), "HmacSHA256"));
            byte[] fullHmac = mac.doFinal(body.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(32);
            for (int i = 0; i < 16; i++) {
                sb.append(String.format("%02x", fullHmac[i] & 0xFF));
            }
            if (sb.toString().equalsIgnoreCase(providedHexSig)) {
                authorizedStreamer = username;
                authorizedUntilEpochSecs = now + 900L;
                return true;
            }
        } catch (Exception ignored) {
        }
        return false;
    }

    public static boolean checkDiskOrMemoryPass(File pluginsFolder) {
        long now = Instant.now().getEpochSecond();
        if (now < authorizedUntilEpochSecs) {
            return true;
        }
        try {
            File passFile = new File(new File(pluginsFolder, "GalacticLive"), "session_pass.txt");
            if (passFile.exists()) {
                String content = Files.readString(passFile.toPath(), StandardCharsets.UTF_8).trim();
                return verifyAndActivateToken(content);
            }
        } catch (Exception ignored) {
        }
        return false;
    }

    public static String getAuthorizedStreamer() {
        return authorizedStreamer;
    }
}
