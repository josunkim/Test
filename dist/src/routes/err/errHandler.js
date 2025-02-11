"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const client_1 = require("@prisma/client");
// 사용 하기 편하게 에러를 만들어 놓았습니다
const ERROR_MESSAGES = {
    DATABASE_QUERY_FAILED: "데이터베이스 요청 오류가 발생했습니다.",
    DATABASE_VALIDATION_FAILED: "데이터베이스 입력값이 올바르지 않습니다.",
    DATABASE_UNKNOWN_ERROR: "알 수 없는 데이터베이스 오류가 발생했습니다.",
    INVALID_JSON_FORMAT: "잘못된 JSON 형식입니다.",
    ROUTE_NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
    UNAUTHORIZED: "로그인이 필요합니다.",
    FORBIDDEN: "접근 권한이 없습니다.",
    SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
    PRISMA_INITIALIZATION_ERROR: "Prisma 클라이언트 초기화 오류가 발생했습니다.",
    PRISMA_RUST_PANIC: "Prisma 클라이언트에서 러스트 패닉 오류가 발생했습니다.",
};
/**
 * 에러 핸들러
 * 각 에러 유형별로 상세한 메시지와 HTTP 상태 코드를 반환합니다.
 */
const handleError = (error) => {
    console.error("Error: ", error);
    // Prisma 관련 에러 처리
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // 에러 코드에 따라 세분화하여 처리합니다.
        switch (error.code) {
            case "P2000":
                // 값이 컬럼의 최대 길이나 범위를 초과한 경우
                return { status: 400, message: "입력한 값이 컬럼 제한보다 큽니다." };
            case "P2001":
                // 레코드를 찾지 못한 경우
                return { status: 404, message: "요청한 데이터를 찾을 수 없습니다." };
            case "P2002":
                // 유니크 제약 조건 위반 (예: 중복된 값)
                // error.meta.target에 어떤 필드가 위반되었는지 정보가 포함될 수 있음
                return {
                    status: 400,
                    message: `유니크 제약 조건 위반: 이미 존재하는 값입니다. (${JSON.stringify(error.meta?.target)})`,
                };
            case "P2003":
                // 외래키 제약 조건 실패
                return {
                    status: 400,
                    message: "외래키 제약 조건 오류가 발생했습니다.",
                };
            case "P2004":
                // 외래키 제약 조건 체크 오류
                return { status: 400, message: "외래키 제약 조건 체크 오류입니다." };
            case "P2005":
                // 필요한 값이 누락된 경우
                return { status: 400, message: "필요한 값이 누락되었습니다." };
            default:
                return { status: 400, message: ERROR_MESSAGES.DATABASE_QUERY_FAILED };
        }
    }
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        // Prisma에서 전달하는 유효성 검사 관련 에러
        return { status: 400, message: ERROR_MESSAGES.DATABASE_VALIDATION_FAILED };
    }
    if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        // 알 수 없는 Prisma 요청 에러
        return { status: 500, message: ERROR_MESSAGES.DATABASE_UNKNOWN_ERROR };
    }
    if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
        // Prisma 클라이언트 초기화 중 발생하는 오류
        return { status: 500, message: ERROR_MESSAGES.PRISMA_INITIALIZATION_ERROR };
    }
    if (error instanceof client_1.Prisma.PrismaClientRustPanicError) {
        // Prisma의 러스트 엔진에서 패닉이 발생한 경우
        return { status: 500, message: ERROR_MESSAGES.PRISMA_RUST_PANIC };
    }
    // JSON 파싱 오류 (예: 클라이언트에서 잘못된 JSON 형식 전송)
    if (error instanceof SyntaxError && "body" in error) {
        return { status: 400, message: ERROR_MESSAGES.INVALID_JSON_FORMAT };
    }
    // 인증/인가 관련 오류
    if (error.name === "UnauthorizedError") {
        return { status: 401, message: ERROR_MESSAGES.UNAUTHORIZED };
    }
    if (error.name === "ForbiddenError") {
        return { status: 403, message: ERROR_MESSAGES.FORBIDDEN };
    }
    if (error.name === "NotFoundError") {
        return { status: 404, message: ERROR_MESSAGES.ROUTE_NOT_FOUND };
    }
    // 그 외 모든 경우 서버 내부 오류로 처리합니다.
    return { status: 500, message: ERROR_MESSAGES.SERVER_ERROR };
};
exports.handleError = handleError;
//# sourceMappingURL=errHandler.js.map