# Build stage
FROM maven:3.9.6-amazoncorretto-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:21
ARG PROFILE=dev
ARG APP_VERSION=0.0.1-SNAPSHOT

WORKDIR /app
COPY --from=build /build/target/applycam-*.jar /app/

EXPOSE 8088

ENV DB_URL=jdbc:mysql://mysql:3306/applycam
ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}
ENV EMAIL_HOSTNAME=missing_host_name
ENV EMAIL_USER_NAME=missing_user_name
ENV EMAIL_PASSWORD=missing_password


CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} applycam-${JAR_VERSION}.jar
