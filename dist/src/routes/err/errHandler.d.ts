/**
 * 에러 핸들러
 * 각 에러 유형별로 상세한 메시지와 HTTP 상태 코드를 반환합니다.
 */
export declare const handleError: (error: any) => {
    status: number;
    message: string;
};
