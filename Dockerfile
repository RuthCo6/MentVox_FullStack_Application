# שלב 1: Build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# העתקת קובץ ה־csproj ושיחזור תלויות
COPY MentVox.Application.csproj ./
RUN dotnet restore MentVox.Application.csproj

# העתקת כל שאר הקבצים ובניית האפליקציה
COPY . ./
RUN dotnet publish MentVox.Application.csproj -c Release -o out

# שלב 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out .

# הגדרת הפורט ש־Render דורש
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# הפעלת השרת שלך
ENTRYPOINT ["dotnet", "MentVox.Application.dll"]
