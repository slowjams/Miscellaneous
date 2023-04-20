FROM microsoft/dotnet:1.1.2-runtime-nanoserver

COPY dist /app

COPY wait.ps1 /app/wait.ps1

WORKDIR /app

EXPOSE 80/tcp

ENV ASPNETCORE_URLS http://+:80

ENTRYPOINT powershell ./wait.ps1; dotnet ExampleApp.dll