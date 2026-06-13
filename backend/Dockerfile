# ─── Stage 1: 构建 ─────────────────────────
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# 复制 pom.xml + lib（含达梦驱动）+ 源码
COPY pom.xml .
COPY lib/ ./lib/
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Stage 2: 运行 ─────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 复制构建产物（达梦驱动已随 Maven system scope 打包进 fat JAR）
COPY --from=builder /app/target/*.jar app.jar

# 健康检查（Spring Boot Actuator）
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-Duser.timezone=Asia/Shanghai", "-jar", "app.jar"]
