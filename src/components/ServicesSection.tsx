import React from "react";
import { Marquee } from "./ui/marquee";

const Services = () => {

  const workflowSet1 = [
    {
      icon: "zapier",
      title: "Zapier Integrations",
      description:
        "Automate Shopify, WooCommerce, and CRM workflows with 6000+ apps on Zapier.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: "make",
      title: "Make.com Scenarios",
      description:
        "Visually build automation pipelines that connect e-commerce tools effortlessly.",
      color: "from-sky-500 to-blue-400",
    },
    {
      icon: "sendgrid",
      title: "SendGrid Email Automation",
      description:
        "Automate transactional and marketing emails like order confirmations, welcome flows, and follow-ups.",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: "mailchimp",
      title: "Mailchimp List Sync",
      description:
        "Keep customer lists in sync across platforms for precise targeting.",
      color: "from-purple-500 to-indigo-400",
    },
    {
      icon: "hubspot",
      title: "HubSpot Deal Automation",
      description:
        "Convert orders to deals and automate customer follow-ups using HubSpot.",
      color: "from-pink-500 to-rose-400",
    },
  ];
  const workflowSet2 = [
    {
      icon: "airtable",
      title: "Airtable Order Tracker",
      description:
        "Track orders, status, and performance metrics in a visual database.",
      color: "from-fuchsia-500 to-pink-400",
    },
    {
      icon: "googlecloud",
      title: "Google Sheets Sync",
      description:
        "Automatically log new orders, updates, and cancellations in Sheets.",
      color: "from-lime-500 to-green-400",
    },
    {
      icon: "asana",
      title: "Asana Task Automation",
      description:
        "Create tasks for fulfillment and customer issues in Asana automatically.",
      color: "from-orange-400 to-yellow-300",
    },
    {
      icon: "trello",
      title: "Trello Order Boards",
      description:
        "Create Kanban cards for each order to streamline operations.",
      color: "from-cyan-500 to-blue-400",
    },
    {
      icon: "slack",
      title: "Slack Team Alerts",
      description:
        "Notify your team in Slack for orders, refunds, or escalations instantly.",
      color: "from-cyan-600 to-teal-400",
    },
  ];
  const workflowSet3 = [
    {
      icon: "stripe",
      title: "Stripe Payment Automation",
      description:
        "Auto-generate receipts, manage refunds, and track payments in real time.",
      color: "from-indigo-500 to-blue-300",
    },
    {
      icon: "paypal",
      title: "PayPal Smart Triggers",
      description:
        "Automate order confirmation and refund flows for PayPal transactions.",
      color: "from-blue-500 to-cyan-300",
    },
    {
      icon: "twilio",
      title: "Twilio SMS Alerts",
      description:
        "Send order confirmations, tracking info, and feedback requests via SMS.",
      color: "from-red-500 to-rose-400",
    },
    {
      icon: "xero",
      title: "Xero Accounting Integration",
      description:
        "Automatically sync order data and revenue into Xero for simplified bookkeeping.",
      color: "from-teal-500 to-emerald-400",
    },
    {
      icon: "quickbooks",
      title: "QuickBooks Integration",
      description:
        "Automatically sync sales and invoices into your QuickBooks account.",
      color: "from-emerald-500 to-lime-400",
    },
  ];
  const workflowSet4 = [
    {
      icon: "notion",
      title: "Notion CRM Board",
      description:
        "Manage customers and orders inside Notion with automated updates.",
      color: "from-neutral-500 to-gray-400",
    },
    {
      icon: "clickup",
      title: "ClickUp Task Automation",
      description:
        "Create tasks and workflows in ClickUp for order processing, fulfillment, and support handling.",
      color: "from-yellow-500 to-orange-400",
    },
   {
  icon: 'basecamp',
  title: 'Basecamp Task Automation',
  description: 'Auto-create and assign tasks for orders, returns, and customer service in Basecamp.',
  color: 'from-yellow-500 to-orange-400'
},
    {
      icon: "webflow",
      title: "Webflow Form Automations",
      description:
        "Trigger customer journeys directly from website form submissions.",
      color: "from-blue-600 to-indigo-500",
    },
    {
      icon: "intercom",
      title: "Intercom Chatbots",
      description:
        "Launch automated chat sequences for abandoned carts and support.",
      color: "from-pink-500 to-purple-400",
    },
    {
      icon: "calendly",
      title: "Calendly for Support Calls",
      description:
        "Schedule support calls automatically for customer escalations.",
      color: "from-indigo-600 to-blue-400",
    },
  ];

  const servicesIcons = workflowSet1.map((tech) => ({
    ...tech,
    icon: `https://cdn.simpleicons.org/${tech.icon}`,
  }));
  const servicesIcons2 = workflowSet2.map((tech) => ({
    ...tech,
    icon: `https://cdn.simpleicons.org/${tech.icon}`,
  }));
  const servicesIcons3 = workflowSet3.map((tech) => ({
    ...tech,
    icon: `https://cdn.simpleicons.org/${tech.icon}`,
  }));
  const servicesIcons4 = workflowSet4.map((tech) => ({
    ...tech,
    icon: `https://cdn.simpleicons.org/${tech.icon}`,
  }));
  const Card = ({ services, reverse = false }: any) => {
    return (
      <Marquee
        pauseOnHover
        reverse={reverse}
        className="[--duration:100s]"
        repeat={12}
      >
        {services.map((service: any, index: any) => (
          <>
            <div
              key={service.icon+index}
              className={`px-4 py-3 bg-white border border-gray-200 rounded-lg min-w-[220px] max-w-[420px] overflow-hidden`}
            >
              {/* Header Section with Icon */}
              <div className="flex items-center gap-3">
                {/* Icon (image or emoji or SVG) */}
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src={service.icon}
                    alt="icon"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Title and Subtext */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {service.title}
                  </p>
                  <p className="text-xs ellipsis overflow-ellipsis text-gray-500">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </>
        ))}
      </Marquee>
    );
  };
  return (
    <section id="services" className="py-24 relative">
      <div className=" mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 section-fade">
          <h2 className="mx-auto mb-2 max-w-3xl text-balance text-[42px] font-medium leading-tight tracking-tighter">
            Everything You Need to Automate Your E-commerce Workflow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From order processing to customer communication, we automate every
            aspect of your e-commerce operations.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Card services={servicesIcons} reverse />
          <Card services={servicesIcons2} />
          <Card services={servicesIcons3} reverse />
          <Card services={servicesIcons4} />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Marquee className={className} pauseOnHover={false} repeat={4} vertical={false} reverse={true}>
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="glass-card p-6 hover:bg-white/[0.05] transition-all duration-500 group cursor-pointer blur-fade"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${service.icon} text-white text-xl`}></i>
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-3 group-hover:text-neon-teal transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>

              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-neon-teal font-medium">Learn more →</span>
              </div>
            </div>
          ))}
          </Marquee>
        </div> */}
      </div>
    </section>
  );
};

export default Services;
