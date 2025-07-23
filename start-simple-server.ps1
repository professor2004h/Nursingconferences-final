# Simple PowerShell HTTP Server
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Simple server started on http://localhost:$port"
Write-Host "Press Ctrl+C to stop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        Write-Host "Request: $url"
        
        # Simple response
        $html = @"
<!DOCTYPE html>
<html>
<head>
    <title>Simple Server</title>
</head>
<body>
    <h1>Server is Running</h1>
    <p>This is a simple PowerShell HTTP server.</p>
    <p>Requested URL: $url</p>
    <p>Node.js is required for the full development servers.</p>
    <a href="https://nodejs.org/">Download Node.js</a>
</body>
</html>
"@
        
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
        $response.ContentLength64 = $buffer.Length
        $response.ContentType = "text/html"
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
