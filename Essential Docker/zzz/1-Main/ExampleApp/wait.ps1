Write-Host "Waiting for:" $env:WAITHOST $env:WAITPORT
do {
 Start-Sleep 1
} until(Test-NetConnection $env:WAITHOST -Port $env:WAITPORT `
 | Where-Object { $_.TcpTestSucceeded });
Write-Host "End of waiting."