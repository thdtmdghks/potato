import { BUSINESS } from "@/shared/constants";

export const metadata = {
  title: `개인정보 처리방침 | ${BUSINESS.name}`,
  description: `${BUSINESS.name}의 개인정보 처리방침입니다.`,
};

export default function PrivacyPolicy() {
  return (
    <article className="text-gray-dark mx-auto max-w-3xl px-4 py-12 md:py-16 dark:text-gray-300">
      <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <h1 className="text-navy text-3xl font-bold dark:text-white">개인정보 처리방침</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">시행일자: 2026년 5월 27일</p>
      </header>

      <section className="mt-8 space-y-6 leading-relaxed">
        <p>
          <strong>{BUSINESS.name}</strong>(이하 &apos;회사&apos;라 함)는 이용자의 개인정보를
          보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
          개인정보 처리방침을 수립·공개합니다.
        </p>

        <div>
          <h2 className="text-navy text-xl font-bold dark:text-white">
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p className="mt-2">
            회사는 다음의 목적을 위해 필요한 최소한의 개인정보를 수집하고 이용합니다. 수집된
            개인정보는 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경되는 경우에는 별도의
            동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>
              <strong>고객 후기(리뷰) 등록 및 관리</strong>: 카카오 소셜 로그인을 통한 본인 식별,
              후기 작성 권한 확인, 후기 작성자 정보(닉네임 및 프로필 사진) 표시.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-navy text-xl font-bold dark:text-white">
            2. 수집하는 개인정보의 항목
          </h2>
          <p className="mt-2">
            회사는 카카오 로그인 연동을 통해 아래와 같은 개인정보 항목을 수집합니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>
              <strong>필수/선택 수집 항목</strong>: 카카오 계정 고유식별값(ID), 카카오 프로필
              닉네임, 카카오 프로필 사진 URL.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-navy text-xl font-bold dark:text-white">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>
              이용자의 개인정보는 **고객이 작성한 후기(리뷰)가 홈페이지에 게재되는 기간 동안** 보유
              및 이용됩니다.
            </li>
            <li>
              작성자가 후기 삭제를 요청하거나 카카오 탈퇴 등으로 식별이 불가능해진 경우, 혹은 수집
              목적이 달성된 경우에는 관련 개인정보를 지체 없이 안전한 방법으로 파기합니다.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-navy text-xl font-bold dark:text-white">
            4. 동의를 거부할 권리 및 거부 시의 불이익
          </h2>
          <p className="mt-2">
            이용자는 회사가 수집하는 개인정보에 대해 동의를 거부할 권리가 있습니다. 단, 동의를
            거부할 경우 카카오 로그인 연동 및 이를 필요로 하는 **홈페이지 내 후기(리뷰) 작성 기능
            이용이 제한**될 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-navy text-xl font-bold dark:text-white">
            5. 개인정보 보호책임자 지정 및 문의
          </h2>
          <p className="mt-2">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의
            불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>
              <strong>개인정보 보호책임자</strong>: 송정관 대표
            </li>
            <li>
              <strong>연락처</strong>: {BUSINESS.phone}
            </li>
            <li>
              <strong>이메일/주소</strong>: {BUSINESS.address}
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
