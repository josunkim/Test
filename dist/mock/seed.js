"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const ko_1 = require("@faker-js/faker/locale/ko");
const mock_1 = require("./mock");
const prisma = new client_1.PrismaClient();
async function main() {
    // 0. 기존 데이터 삭제
    console.log("기존데이터를 삭제합니다.");
    await prisma.bookmark.deleteMany();
    await prisma.userApplications.deleteMany();
    await prisma.users.deleteMany();
    await prisma.companies.deleteMany();
    const USER_COUNT = 100;
    // 1. 카테고리 데이터 삽입 (중복 카테고리 방지)
    const categories = await Promise.all([...new Set(mock_1.COMPANIES.map((company) => company.category))].map(async (categoryName) => {
        // 카테고리 존재 여부 확인 (category는 유니크한 값이 아니기 때문에 findFirst로 검색)
        let existingCategory = await prisma.category.findFirst({
            where: { category: categoryName },
        });
        if (!existingCategory) {
            // 카테고리가 존재하지 않으면 새로 생성
            existingCategory = await prisma.category.create({
                data: { category: categoryName },
            });
        }
        return existingCategory;
    }));
    // 2. 회사 데이터 삽입 (Companies 테이블)
    const createdCompanies = []; //생성된 회사들 저장할 배열
    for (const company of mock_1.COMPANIES) {
        const createdCompany = await prisma.companies.create({
            data: {
                name: company.name,
                image: company.image || null, // 이미지가 없으면 null로 처리
                content: company.content,
                salesRevenue: company.salesRevenue,
                employeeCnt: company.employeeCnt,
                createdAt: new Date(company.createdAt),
                updatedAt: new Date(company.updatedAt),
                deletedAt: null, // 삭제된 데이터는 없다고 가정
                // 카테고리 연결 (다대다 관계)
                category: {
                    connect: categories
                        .filter((cat) => company.category === cat.category)
                        .map((cat) => ({ id: cat.id })),
                },
            },
        });
        createdCompanies.push(createdCompany); // 생성된 회사들 배열에 추가
        console.log(`${createdCompany.name} 회사 등록이 완료되었습니다. `);
    }
    // 3. 사용자 100명 생성
    // 데이터베이스에서 모든 회사의 ID를 가져오기
    // 회사 데이터를 `createdCompanies` 배열에서 가져와서 사용
    const companyIds = createdCompanies.map((company) => company.id);
    for (let i = 0; i < USER_COUNT; i++) {
        // 사용자 기본 정보 생성
        const userName = ko_1.faker.person.fullName();
        const user = await prisma.users.create({
            data: {
                email: ko_1.faker.internet.email(),
                password: "password123", // 해시화 없이 단순 문자열로 저장
                name: userName, // 생성한 이름 사용
                nickname: userName + ko_1.faker.number.int({ min: 1, max: 999 }), // 이름 + 숫자
            },
        });
        // 북마크 생성 (5~30개, 중복 없이)
        const bookmarkCount = ko_1.faker.number.int({ min: 5, max: 30 });
        const shuffledCompaniesForBookmark = ko_1.faker.helpers.shuffle([...companyIds]);
        const selectedCompaniesForBookmark = shuffledCompaniesForBookmark.slice(0, bookmarkCount);
        for (const companyId of selectedCompaniesForBookmark) {
            await prisma.bookmark.create({
                data: {
                    userId: user.id,
                    companyId,
                },
            });
        }
        // 지원 내역 생성 (5~30개, 중복 없이)
        const applicationCount = ko_1.faker.number.int({ min: 5, max: 30 });
        const shuffledCompaniesForApplication = ko_1.faker.helpers.shuffle([
            ...companyIds,
        ]);
        const selectedCompaniesForApplication = shuffledCompaniesForApplication.slice(0, applicationCount);
        for (const companyId of selectedCompaniesForApplication) {
            const status = ko_1.faker.helpers.arrayElement([
                client_1.ApplicationStatus.PENDING,
                client_1.ApplicationStatus.ACCEPTED,
                client_1.ApplicationStatus.REJECTED,
            ]);
            await prisma.userApplications.create({
                data: {
                    userId: user.id,
                    companyId,
                    status,
                },
            });
        }
        // 진행 상황 로깅
        if ((i + 1) % 10 === 0) {
            console.log(`Created ${i + 1} users with their bookmarks and applications`);
        }
    }
    // 최종 데이터 수 확인
    const userCount = await prisma.users.count();
    const bookmarkCount = await prisma.bookmark.count();
    const applicationCount = await prisma.userApplications.count();
    console.log("\nSeed data creation completed!");
    console.log(`Created ${userCount} users`);
    console.log(`Created ${bookmarkCount} bookmarks`);
    console.log(`Created ${applicationCount} applications`);
}
main()
    .catch((e) => {
    console.error(e);
    throw e;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map