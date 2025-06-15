import React from "react";

const TermsContent: React.FC = () => {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-12 text-white">
            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">Introduction</h2>
                <p className="text-secondary-400 mb-4">
                    By using Veoi3, you acknowledge that you have read, understood, and accepted these terms and
                    conditions.
                    These terms apply to all visitors, users, and anyone accessing or using our website or services. If
                    you
                    disagree with any part of these terms, you are prohibited from using this website and its services.
                </p>
                <p className="text-secondary-400">
                    We may update these terms from time to time, and any changes will take effect immediately upon being
                    posted. It is your responsibility to review these terms periodically to stay informed of any
                    updates.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
                <p className="text-secondary-400">
                    By creating an account, accessing, or using any part of Veoi3&#39;s services, you signify your agreement
                    to be
                    bound by these Terms of Service, along with any other policies or guidelines referenced herein. Your
                    continued use of the platform after any modifications constitutes your acceptance of the revised
                    terms.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">2. Changes to Terms</h2>
                <p className="text-secondary-400">
                    Veoi3 reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a
                    revision is
                    material, we will provide at least 30 days’ notice prior to any new terms taking effect. What
                    constitutes a
                    material change will be determined at our sole discretion. It is your responsibility to review these
                    terms
                    periodically to stay informed of any updates.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">3. Use of Tokens & Credits</h2>
                <p className="text-secondary-400">
                    This service operates on a token-based credit system. Each video generation or specific feature
                    utilization
                    consumes tokens from your available balance. Charges are applied automatically based on Veoi3’s
                    prevailing processing rates, which may be updated from time to time. Users are solely responsible
                    for
                    monitoring and managing their token usage, and understanding the consumption rates for various
                    operations. Tokens are non-refundable once purchased, unless otherwise stated in our refund policy.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">4. Content Responsibility & Limitations</h2>
                <p className="text-secondary-400 mb-2">
                    All content generated through Veoi3’s service is the sole responsibility of the requesting user.
                    Veoi3 acts
                    merely as a tool and holds no liability for:
                </p>
                <ul className="list-disc text-secondary-400 pl-6 space-y-1 mb-4">
                    <li>Unlawful Use: Any illegal, unauthorized, or otherwise unlawful use of generated content.</li>
                    <li>
                        Ethical or Reputational Consequences: Any ethical implications, reputational damage, or negative
                        societal
                        impact arising from the generated content.
                    </li>
                    <li>
                        Intellectual Property Violations: Claims of copyright infringement, trademark violations, or any
                        other
                        intellectual property rights violations caused by the user&#39;s prompts, inputs, or the subsequent
                        use of
                        generated content. Users are responsible for ensuring they have the necessary rights to use all
                        input
                        material and the output generated.
                    </li>
                </ul>
                <p className="text-secondary-400">
                    Additionally, AI-generated outputs may contain inaccuracies, unintended results, or may not always
                    align
                    with factual correctness or specific creative intentions. You are solely responsible for reviewing,
                    verifying,
                    and validating any generated content before public display, commercial use, or any form of
                    distribution. We
                    provide no guarantees of factual correctness, fitness for any particular purpose, or suitability for
                    any specific
                    application.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">5. Prohibited Use</h2>
                <p className="text-secondary-400 mb-2">
                    You may not use Veoi3’s services to create, share, distribute, or attempt to produce any content
                    that includes:
                </p>
                <ul className="list-disc text-secondary-400 pl-6 space-y-1 mb-4">
                    <li>
                        Hate Speech & Threats: Any material that promotes hate speech, violence, threats, harassment,
                        discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or
                        any other
                        protected characteristic.
                    </li>
                    <li>
                        Pornographic or Explicit Adult Content: Any sexually explicit, pornographic, or otherwise
                        inappropriate
                        adult content.
                    </li>
                    <li>
                        False or Misleading Information: Any content that is false, misleading, manipulated, or intended
                        to deceive,
                        incite fear, or spread disinformation.
                    </li>
                    <li>
                        Intellectual Property Infringement: Any content that infringes on copyrights, trademarks,
                        patents, trade
                        secrets, or other proprietary or legal rights of any third party.
                    </li>
                    <li>
                        Malware & Harmful Content: Any content that contains viruses, malware, or other harmful code.
                    </li>
                </ul>
                <p className="text-secondary-400">
                    Violations of these prohibited uses may result in immediate account suspension or termination,
                    removal of
                    content, and may be reported to relevant legal authorities.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">6. AI Content Watermarking</h2>
                <p className="text-secondary-400 mb-2">
                    For transparency and identification, all videos generated through Veoi3’s platform will
                    automatically include a
                    visible watermark indicating that the content was AI-generated.
                </p>
                <p className="text-secondary-400">
                    However, if the video is downloaded by the original prompt creator (the user whose account generated
                    the
                    content), the watermark will be automatically removed from the downloaded file. This policy aims to
                    ensure
                    transparency regarding the AI origin of content while respecting user ownership over their creative
                    input for
                    their personal use.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-2">7. Privacy Policy</h2>
                <p className="text-secondary-400">
                    Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by
                    reference,
                    describes how we collect, use, and protect your personal data. By using Veoi3, you also agree to the
                    terms of
                    our Privacy Policy. We encourage you to read it carefully to understand our data practices.
                </p>
            </div>
        </section>
    );
};

export default TermsContent;
