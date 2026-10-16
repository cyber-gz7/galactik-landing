$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$galactkRoot = Split-Path -Parent $PSScriptRoot
$galactkIcons = Join-Path $galactkRoot 'src-tauri/icons'
$galactkLogo = [System.Drawing.Image]::FromFile((Join-Path $galactkIcons 'icon.png'))
function New-GalactkBitmap([int]$Width, [int]$Height, [string]$Name) {
  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $bounds = [System.Drawing.Rectangle]::new(0, 0, $Width, $Height)
  $bg = [System.Drawing.Drawing2D.LinearGradientBrush]::new($bounds, [System.Drawing.ColorTranslator]::FromHtml('#05070B'), [System.Drawing.ColorTranslator]::FromHtml('#0A1424'), 70)
  $cyan = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#00F2FE'))
  $white = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#F8FAFC'))
  $muted = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#94A3B8'))
  $line = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(50, 0, 242, 254), 1)
  $title = [System.Drawing.Font]::new('Segoe UI', 15, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $caption = [System.Drawing.Font]::new('Segoe UI', 7.8, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  try {
    $graphics.FillRectangle($bg, $bounds)
    if ($Height -gt 100) {
      $graphics.DrawLine($line, 18, 0, 18, 150)
      $graphics.DrawLine($line, 146, 160, 146, 314)
      for ($i = 28; $i -ge 1; $i--) {
        $halo = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(2, 0, 242, 254))
        $graphics.FillEllipse($halo, [single](38-$i), [single](63-$i), [single](88+2*$i), [single](88+2*$i))
        $halo.Dispose()
      }
      $graphics.DrawImage($galactkLogo, 38, 63, 88, 88)
      $graphics.DrawString('GALACTK PANEL', $title, $white, [single]18, [single]183)
      $graphics.DrawString('PRO BROADCAST SUITE', $caption, $muted, [single]19, [single]210)
      $graphics.FillRectangle($cyan, 19, 236, 28, 2)
      $graphics.DrawString('TU COMUNIDAD. TU CONTROL.', $caption, $muted, [single]19, [single]282)
    } else {
      $graphics.DrawImage($galactkLogo, 8, 10, 36, 36)
      $small = [System.Drawing.Font]::new('Segoe UI', 10, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
      $graphics.DrawString('GALACTK PANEL', $small, $white, [single]49, [single]15)
      $graphics.DrawString('PRO BROADCAST SUITE', $caption, $muted, [single]49, [single]31)
      $small.Dispose()
    }
    $bitmap.Save((Join-Path $galactkIcons $Name), [System.Drawing.Imaging.ImageFormat]::Bmp)
    "$Name : $Width x $Height / 24-bit"
  } finally {
    $title.Dispose(); $caption.Dispose(); $line.Dispose(); $white.Dispose(); $muted.Dispose(); $cyan.Dispose(); $bg.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
  }
}
try {
  New-GalactkBitmap 164 314 'nsis-sidebar.bmp'
  New-GalactkBitmap 150 57 'nsis-header.bmp'
  Copy-Item -LiteralPath (Join-Path $galactkIcons 'icon.png') -Destination (Join-Path $galactkRoot 'ui/galactk-logo.png')
} finally { $galactkLogo.Dispose() }
