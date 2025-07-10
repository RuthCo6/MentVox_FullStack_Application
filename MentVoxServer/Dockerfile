# שלב 1: Build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# העתקת קובץ ה־csproj בלבד (לצורך restore)
COPY MentVox.Application.Api/MentVox.Application.csproj ./
RUN dotnet restore MentVox.Application.csproj

# העתקת שאר קבצי הפרויקט לצורך build
COPY MentVox.Application.Api/ ./
RUN dotnet publish MentVox.Application.csproj -c Release -o /app/out

# שלב 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out .

# הגדרת הפורט ש־Render דורש
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "MentVox.Application.dll"]
