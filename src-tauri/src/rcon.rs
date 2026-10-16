use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;
use tokio::time::timeout;

const SERVERDATA_AUTH: i32 = 3;
const SERVERDATA_EXECCOMMAND: i32 = 2;
const SERVERDATA_AUTH_RESPONSE: i32 = 2;
const SERVERDATA_RESPONSE_VALUE: i32 = 0;
const TIMEOUT_DURATION: Duration = Duration::from_secs(5);

pub struct RconClient {
    stream: TcpStream,
    req_id_counter: i32,
}

impl RconClient {
    pub async fn connect(host: &str, port: u16, password: &str) -> Result<Self, String> {
        let addr = format!("{}:{}", host, port);
        let stream = match timeout(TIMEOUT_DURATION, TcpStream::connect(&addr)).await {
            Ok(Ok(s)) => s,
            Ok(Err(e)) => return Err(format!("Error de conexión RCON a {}: {}", addr, e)),
            Err(_) => return Err(format!("Timeout al conectar a {}", addr)),
        };

        let mut client = Self {
            stream,
            req_id_counter: 1,
        };

        client.authenticate(password).await?;
        Ok(client)
    }

    async fn authenticate(&mut self, password: &str) -> Result<(), String> {
        let auth_id = self.req_id_counter;
        self.req_id_counter += 1;

        self.send_packet(auth_id, SERVERDATA_AUTH, password).await?;

        loop {
            let (resp_id, resp_type, _) = self.read_packet().await?;
            if resp_id == -1 {
                return Err("Contraseña RCON incorrecta".to_string());
            }

            if resp_type == SERVERDATA_AUTH_RESPONSE {
                if resp_id == auth_id {
                    return Ok(());
                } else {
                    return Err(
                        "Fallo en autenticación RCON: ID de respuesta no coincide".to_string()
                    );
                }
            }
        }
    }

    pub async fn send_command(&mut self, cmd: &str) -> Result<String, String> {
        let cmd_id = self.req_id_counter;
        self.req_id_counter += 1;

        self.send_packet(cmd_id, SERVERDATA_EXECCOMMAND, cmd)
            .await?;

        let (resp_id, resp_type, payload) = self.read_packet().await?;
        if resp_id != cmd_id && resp_type != SERVERDATA_RESPONSE_VALUE {
            return Err(format!(
                "Respuesta RCON inesperada (id={}, type={})",
                resp_id, resp_type
            ));
        }

        Ok(payload)
    }

    async fn send_packet(
        &mut self,
        id: i32,
        packet_type: i32,
        payload: &str,
    ) -> Result<(), String> {
        let payload_bytes = payload.as_bytes();
        let length = (4 + 4 + payload_bytes.len() + 2) as i32;

        let mut packet = Vec::with_capacity((length + 4) as usize);
        packet.extend_from_slice(&length.to_le_bytes());
        packet.extend_from_slice(&id.to_le_bytes());
        packet.extend_from_slice(&packet_type.to_le_bytes());
        packet.extend_from_slice(payload_bytes);
        packet.push(0x00);
        packet.push(0x00);

        match timeout(TIMEOUT_DURATION, self.stream.write_all(&packet)).await {
            Ok(Ok(_)) => Ok(()),
            Ok(Err(e)) => Err(format!("Error enviando paquete RCON: {}", e)),
            Err(_) => Err("Timeout enviando paquete RCON".to_string()),
        }
    }

    async fn read_packet(&mut self) -> Result<(i32, i32, String), String> {
        let mut len_buf = [0u8; 4];
        match timeout(TIMEOUT_DURATION, self.stream.read_exact(&mut len_buf)).await {
            Ok(Ok(_)) => {}
            Ok(Err(e)) => return Err(format!("Error leyendo tamaño de paquete RCON: {}", e)),
            Err(_) => return Err("Timeout esperando respuesta RCON".to_string()),
        }

        let length = i32::from_le_bytes(len_buf);
        if length < 10 || length > 65535 {
            return Err(format!("Tamaño de paquete RCON inválido: {}", length));
        }

        let mut body = vec![0u8; length as usize];
        match timeout(TIMEOUT_DURATION, self.stream.read_exact(&mut body)).await {
            Ok(Ok(_)) => {}
            Ok(Err(e)) => return Err(format!("Error leyendo cuerpo de paquete RCON: {}", e)),
            Err(_) => return Err("Timeout leyendo cuerpo de respuesta RCON".to_string()),
        }

        let resp_id = i32::from_le_bytes([body[0], body[1], body[2], body[3]]);
        let resp_type = i32::from_le_bytes([body[4], body[5], body[6], body[7]]);

        let payload_len = (length as usize).saturating_sub(10);
        let payload_bytes = &body[8..8 + payload_len];
        let payload_str = String::from_utf8_lossy(payload_bytes).to_string();

        Ok((resp_id, resp_type, payload_str))
    }
}
