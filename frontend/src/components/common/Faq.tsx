import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import faqImg from "@/assets/player/faq1.jpg";

const faqs = [
  {
    question: "How do I book a game?",
    answer:
      "You can book a game by selecting your sport, location, date, and time using our search bar, then confirming your slot in the booking section.",
  },
  {
    question: "Can I cancel or reschedule?",
    answer:
      "Yes! You can cancel or reschedule your booking up to 24 hours before the scheduled time without any extra charges.",
  },
  {
    question: "Are the venues verified?",
    answer:
      "All venues listed on our platform are verified for safety and hygiene standards to ensure the best experience.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact our support team through the 'Help & Support' section in your profile or via the chat icon on the dashboard.",
  },
];

const Faq = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Image */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <img
            src={faqImg}
            alt="FAQ Illustration"
            className="w-full max-w-md"
          />
        </div>

        {/* Right Accordion */}
        <div className="flex-1">
          {/* Breadcrumb / Header */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Home / Support / FAQ</p>
            <h2 className="text-3xl font-bold text-[#1061dc]">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mt-2">
              Here are answers to some of the most common questions about our platform.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                <AccordionTrigger className="text-gray-800 font-medium px-4 py-3 hover:bg-gray-100 rounded-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
