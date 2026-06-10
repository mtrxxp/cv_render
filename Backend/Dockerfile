FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY Backend/pom.xml ./Backend/
RUN mvn dependency:go-offline

COPY Backend/src ./Backend/src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]