"use client";

import { PageContent } from "../components/page-content";

export default function TermsOfServicePage() {
  return (
    <div className="py-10 sm:py-14">
      <PageContent
        pageType="TERMS_OF_SERVICE"
        heading="Terms of Service"
        description="Read the full terms governing use of this store."
        fullWidth
      />
    </div>
  );
}
