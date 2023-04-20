FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

COPY dist /app

WORKDIR /app

EXPOSE 80/tcp

ENTRYPOINT ["dotnet", "ExampleApp.dll"]