"use client";

import { PageContent } from "../components/page-content";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-10 sm:py-14">
      <PageContent
        pageType="PRIVACY_POLICY"
        heading="Privacy Policy"
        description="Understand how your data is collected, used, and protected."
        fullWidth
      />
    </div>
  );
}
