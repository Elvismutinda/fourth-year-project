export type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "select";
  options?: string[]; // for select inputs
  required: boolean;
};

export type DocumentType = {
  name: string;
  slug: string;
  description?: {
    summary: string;
    details?: string[];
    prerequisites?: string[];
    process?: string[];
    note?: string;
  };
  fields: FormField[];
};

export type DocumentCategory = {
  category: string;
  documents: DocumentType[];
};

export const documents: DocumentCategory[] = [
  {
    category: "Affidavits",
    documents: [
      {
        name: "Affidavit for Change of NTSA TIMS Account Phone Number",
        slug: "affidavit-for-change-of-ntsa-tims-account-phone-number",
        description: {
          summary:
            "An Affidavit for Change of NTSA TIMS (Transport Integrated Management Systems) Account Phone Number is a sworn statement, usually made before a notary public or a commissioner for oaths, in which an individual declares their intention to change the phone number associated with their NTSA TIMS account.",
          note: "This affidavit should be sworn before a Commissioner for Oaths, who will verify the identity of the deponent and witness the signing.",
        },
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "idNumber",
            label: "ID Number",
            type: "text",
            required: true,
          },
          {
            name: "oldPhone",
            label: "Old Phone Number",
            type: "text",
            required: true,
          },
          {
            name: "newPhone",
            label: "New Phone Number",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Lost or Misplaced Motor Vehicle Logbook",
        slug: "affidavit-for-lost-or-misplaced-motor-vehicle-logbook",
        description: {
          summary:
            "An Affidavit for Lost or Misplaced Motor Vehicle Logbook in Kenya is a sworn legal document that declares that the original logbook for their motor vehicle has been lost, misplaced, or cannot be traced. It is a prerequisite when applying for a duplicate logbook with National Transport and Safety Authority (NTSA).",
          prerequisites: ["Police abstract.", "Tape lifting report."],
          process: [
            "Edit the template to match your details",
            "Sign before a Commissioner For Oaths, Notary Public, Magistrate, or Consular Officer",
            "Obtain a police abstract",
            "Take the vehicle for tape lift",
            "Submit the affidavit together with police abstract and tape lift report when applying for duplicate logbook on NTSA TIMS",
          ],
          note: "This affidavit should be sworn before a Commissioner for Oaths, who will verify the identity of the deponent and witness the signing.",
        },
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "idNumber",
            label: "ID Number",
            type: "text",
            required: true,
          },
          {
            name: "vehicleRegNumber",
            label: "Vehicle Registration Number",
            type: "text",
            required: true,
          },
          {
            name: "chassisNumber",
            label: "Chassis Number",
            type: "text",
            required: true,
          },
          {
            name: "dateLost",
            label: "Date of Loss",
            type: "date",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Lost or Misplaced Share Certificate",
        slug: "affidavit-for-lost-or-misplaced-share-certificate",
        description: {
          summary:
            "An Affidavit for Lost or Misplaced Share Certificate is a sworn legal document attesting to the fact that a shareholder of a particular company has lost or misplaced their share certificate. This affidavit is usually needed by the company when a shareholder claims that their share certificate has been lost or misplaced and needs a duplicate certificate to be issued.",
          details: [
            "Details of the Deponent.",
            "Declaration of Ownership.",
            "Details of the Share Certificate.",
            "Circumstances of Loss",
            "Declaration of no Malicious Intent.",
          ],
          note: "Make sure you present it to a commissioner for oaths near you for signing.",
        },
        fields: [
          {
            name: "fullName",
            label: "Shareholder Full Name",
            type: "text",
            required: true,
          },
          {
            name: "certificateNumber",
            label: "Certificate Number",
            type: "text",
            required: false,
          },
          {
            name: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
          },
          {
            name: "dateLost",
            label: "Date of Loss",
            type: "date",
            required: false,
          },
        ],
      },
      {
        name: "Affidavit for Lost Kenyan Identity Card",
        slug: "affidavit-for-lost-kenyan-id",
        description: {
          summary:
            "An affidavit for a lost Kenyan Identity Card (ID) is a sworn statement made before a commissioner of oaths or notary public by an individual who has lost their Kenyan ID.",
          process: [
            "You will need to fill the required details.",
            "Download the created document and print.",
            "Sign it before a Commissioner for oaths or Notary public.",
          ],
        },
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "idNumber",
            label: "Lost ID Number",
            type: "text",
            required: true,
          },
          {
            name: "dateLost",
            label: "Date of Loss",
            type: "date",
            required: false,
          },
          {
            name: "placeLost",
            label: "Place of Loss",
            type: "text",
            required: false,
          },
        ],
      },
      {
        name: "Affidavit for Change of Name After Marriage",
        slug: "affidavit-for-change-of-name-after-marriage",
        description: {
          summary:
            "This affidavit is a legal document that verifies your voluntary decision to adopt a new name after getting married.",
          prerequisites: [
            "Name before marriage",
            "Name after marriage",
            "Name of spouse",
            "National Identity Card No of Spouse",
            "Date of Marriage",
          ],
          note: "Once you fill the affidavit, you will need to sign it before a Commissioner for Oaths or Notary Public.",
        },
        fields: [
          {
            name: "formerName",
            label: "Former Name",
            type: "text",
            required: true,
          },
          { name: "newName", label: "New Name", type: "text", required: true },
          {
            name: "idNumber",
            label: "ID Number",
            type: "text",
            required: true,
          },
          {
            name: "spouseName",
            label: "Spouse's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "marriageDate",
            label: "Date of Marriage",
            type: "date",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Discrepancy in Names in Kenya",
        slug: "affidavit-for-discrepancy-in-names-in-kenya",
        description: {
          summary:
            "Name inconsistencies in across documents can lead to complications in professional, legal and personal matters. Our platform offers a quick solution for Kenyans to seamlessly and easily generate an Affidavit for Discrepancy in Names.",
        },
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "idNumber",
            label: "ID Number",
            type: "text",
            required: false,
          },
          {
            name: "variantNames",
            label: "Different Names Used (comma separated)",
            type: "textarea",
            required: true,
          },
          {
            name: "documents",
            label: "Documents with Discrepancies",
            type: "textarea",
            required: false,
          },
        ],
      },
      {
        name: "Proof of Marriage Affidavit in Kenya",
        slug: "proof-of-marriage-affidavit-in-kenya",
        description: {
          summary:
            "In Kenya, the Proof of Customary Marriage Affidavit acts as a formal declaration verifying the authenticity of a marriage established based on African traditional customs and practices. As customary marriages might not always have official marriage certificates, this affidavit provides a vital instrument to confirm such union.",
          details: [
            "Names and ID numbers of both parties.",
            "Year of customary marriage and tribe",
          ],
          note: "After downloading, print and sign it before commissioner for oaths.",
        },
        fields: [
          {
            name: "husbandName",
            label: "Husband's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "wifeName",
            label: "Wife's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "marriageDate",
            label: "Date of Marriage",
            type: "date",
            required: true,
          },
          {
            name: "marriagePlace",
            label: "Place of Marriage",
            type: "text",
            required: true,
          },
          {
            name: "witnessNames",
            label: "Names of Witnesses (optional)",
            type: "textarea",
            required: false,
          },
        ],
      },
      {
        name: "Lost Motor Vehicle Number Plate Affidavit",
        slug: "lost-motor-vehicle-number-plate-affidavit",
        description: {
          summary:
            "Looking for a hassle-free solution to replace your lost motor vehicle number plate in Kenya? Our Lost Motor Vehicle Number Plate Affidavit template has got you covered. Our expertly crafted affidavits comply with Kenyan legal requirements, ensuring a smooth process. Obtain the necessary documentation to facilitate the replacement of your lost number plate quickly and efficiently.",
        },
        fields: [
          {
            name: "fullName",
            label: "Owner's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "vehicleRegNumber",
            label: "Vehicle Registration Number",
            type: "text",
            required: true,
          },
          {
            name: "plateLost",
            label: "Plate Lost (Front or Rear)",
            type: "text",
            required: true,
          },
          {
            name: "dateLost",
            label: "Date of Loss",
            type: "date",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Change of Motor Vehicle Engine Number",
        slug: "affidavit-for-change-of-motor-vehicle-engine-number",
        description: {
          summary:
            "Experience a hassle-free process for changing the engine number of your motor vehicle in Kenya with our comprehensive Affidavit for Change of Motor Vehicle Engine Number service. Our expertly crafted affidavits adhere to the legal requirements and procedures set forth by the Kenyan authorities. Easily obtain the necessary documentation to ensure a smooth and compliant engine number change process.",
        },
        fields: [
          {
            name: "fullName",
            label: "Owner's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "vehicleRegNumber",
            label: "Vehicle Registration Number",
            type: "text",
            required: true,
          },
          {
            name: "oldEngineNumber",
            label: "Old Engine Number",
            type: "text",
            required: true,
          },
          {
            name: "newEngineNumber",
            label: "New Engine Number",
            type: "text",
            required: true,
          },
          {
            name: "reasonForChange",
            label: "Reason for Change",
            type: "textarea",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Lost Kenyan Passport",
        slug: "affidavit-for-lost-kenyan-passport",
        description: {
          summary:
            "A lost passport affidavit in Kenya is an official document used to report the loss of a Kenyan passport.",
          details: [
            "Details of the affiant",
            "Passport information",
            "Circumstances of the loss",
            "Actions taken",
            "Declaration of truth",
          ],
          note: "It is important to submit the affidavit along with other required documents to the Kenyan Directorate of Immigration Services to initiate the replacement process.",
        },
        fields: [
          {
            name: "fullName",
            label: "Passport Holder's Name",
            type: "text",
            required: true,
          },
          {
            name: "passportNumber",
            label: "Passport Number",
            type: "text",
            required: true,
          },
          {
            name: "dateLost",
            label: "Date of Loss",
            type: "date",
            required: true,
          },
          {
            name: "placeLost",
            label: "Place of Loss",
            type: "text",
            required: false,
          },
        ],
      },
      {
        name: "Affidavit for Lost KCPE Certificate",
        slug: "affidavit-for-lost-kcpe-certificate",
        description: {
          summary:
            "An affidavit for the loss of a Kenya Certificate of Primary Education (KCPE) is a legal document in which the declarant affirms under oath that they have lost their KCPE certificate. This certificate signifies the completion of primary education in Kenya.",
          details: [
            "Their full name, residential address, and national identification details.",
            "A statement indicating that they were indeed the lawful recipient of a KCPE certificate, including specifics such as the year of receipt and the registration number.",
            "An acknowledgment that the said certificate has been lost, and despite diligent efforts, the declarant has been unable to locate it.",
            "An assurance that the declarant has not pledged, sold, assigned, transferred, or otherwise disposed of the certificate.",
            "An acknowledgment that any false statements made in the affidavit may lead to legal repercussions under Kenyan law.",
          ],
          note: "Once drafted, the declarant must swear to the truthfulness of the contents before a Commissioner for Oaths or Notary Public. This grants the affidavit legal standing and can then be used to apply for a replacement of the lost KCPE certificate, or to prove to potential educational institutions that the declarant completed their primary education despite the loss of the certificate.",
        },
        fields: [
          {
            name: "fullName",
            label: "Candidate Name",
            type: "text",
            required: true,
          },
          {
            name: "indexNumber",
            label: "KCPE Index Number",
            type: "text",
            required: true,
          },
          {
            name: "year",
            label: "Year of Examination",
            type: "number",
            required: true,
          },
          {
            name: "schoolName",
            label: "School Name",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Lost KCSE Certificate",
        slug: "affidavit-for-lost-kcse-certificate",
        description: {
          summary:
            "An affidavit for the loss of a Kenya Certificate of Secondary Education (KCSE) is a legal document sworn in front of an authority like a Commissioner for Oaths or Notary Public, in which the deponent (the person making the affidavit) declares and affirms that they have lost their KCSE certificate.",
          details: [
            "The deponent's full name, address, and identification details.",
            "The deponent's affirmation that they were the lawful recipient of a KCSE certificate, along with details such as the year of award and registration number.",
            "A statement that the certificate has been lost and, despite diligent search and efforts, the deponent has been unable to locate it.",
            "An assurance that the deponent has not pledged, sold, assigned, transferred or otherwise disposed of the said certificate.",
            "An acknowledgment that making false statements in the affidavit could lead to legal consequences under Kenyan law.",
          ],
        },
        fields: [
          {
            name: "fullName",
            label: "Candidate Name",
            type: "text",
            required: true,
          },
          {
            name: "indexNumber",
            label: "KCSE Index Number",
            type: "text",
            required: true,
          },
          {
            name: "year",
            label: "Year of Examination",
            type: "number",
            required: true,
          },
          {
            name: "schoolName",
            label: "School Name",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Affidavit for Proof of Residence",
        slug: "affidavit-for-proof-of-residence",
        description: {
          summary:
            "Affidavit for Proof of Residence is a legal document used to declare and affirm one's current residential address. It serves as a means to provide evidence of where an individual resides. This type of affidavit can be requested for various purposes, such as applying for government services, obtaining identification documents, opening bank accounts, or other official transactions where proof of residence is required.",
          note: "Please note that it is crucial to have the affidavit signed and sealed in the presence of a Commissioner for Oaths or a Notary Public to validate its authenticity.",
        },
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "idNumber",
            label: "ID Number",
            type: "text",
            required: true,
          },
          {
            name: "residentialAddress",
            label: "Current Residence (Location, Town, County)",
            type: "textarea",
            required: true,
          },
          {
            name: "duration",
            label: "Duration of Stay",
            type: "text",
            required: false,
          },
        ],
      },
    ],
  },
  {
    category: "Contracts and Agreements",
    documents: [
      {
        name: "Employment Contract",
        slug: "employment-contract",
        description: {
          summary:
            "An employment contract in Kenya is a legally binding agreement that governs the relationship between an employer and an employee. The Employment Act (No. 11 of 2007) defines an employment contract as “an agreement, whether oral or written, and whether expressed or implied, to employ or to serve as a worker for a certain period.” This contract is essential for outlining the terms and conditions of employment, ensuring both parties understand their rights and responsibilities.",
          details: [
            "Names and addresses of both parties.",
            "Job title and description.",
            "Type of employment (full-time, part-time, temporary).",
            "Commencement date and duration.",
            "Employee duties and responsibilities.",
            "Compensation and benefits.",
            "Working hours and leave entitlements.",
            "Internal policies and rules.",
            "Termination conditions.",
          ],
        },
        fields: [
          {
            name: "employerName",
            label: "Employer Name",
            type: "text",
            required: true,
          },
          {
            name: "employeeName",
            label: "Employee Name",
            type: "text",
            required: true,
          },
          { name: "position", label: "Position", type: "text", required: true },
          {
            name: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
          },
          { name: "salary", label: "Salary", type: "number", required: true },
          {
            name: "duration",
            label: "Duration of Employment",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Loan Agreement",
        slug: "loan-agreement",
        description: {
          summary:
            "A loan agreement is a legally binding contract between a lender and a borrower. This document outlines the terms under which the borrower agrees to repay the loan amount within the specified time frame, including interest, security, and repayment schedule.",
          details: [
            "Names and addresses of both parties.",
            "Loan amount and currency.",
            "Interest rate (fixed or variable).",
            "Repayment terms and schedule.",
            "Loan term (start date and end date).",
            "Collateral or security (if any).",
            "Late payment penalties.",
            "Default conditions and remedies.",
          ],
        },
        fields: [
          {
            name: "lenderName",
            label: "Lender Name",
            type: "text",
            required: true,
          },
          {
            name: "borrowerName",
            label: "Borrower Name",
            type: "text",
            required: true,
          },
          {
            name: "loanAmount",
            label: "Loan Amount",
            type: "number",
            required: true,
          },
          {
            name: "interestRate",
            label: "Interest Rate",
            type: "number",
            required: true,
          },
          {
            name: "repaymentSchedule",
            label: "Repayment Schedule",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Hotel Management Agreement",
        slug: "hotel-management-agreement",
        description: {
          summary:
            "A Hotel Management Agreement is a contract between a hotel owner and a management company. This agreement outlines the responsibilities of the management company to operate and manage the hotel, including staff hiring, maintenance, marketing, and financial management.",
          details: [
            "Names and addresses of both parties.",
            "Hotel details and location.",
            "Management company details and scope of responsibilities.",
            "Compensation structure (fees, profit sharing).",
            "Duration of the agreement.",
            "Reporting and auditing requirements.",
            "Termination clauses.",
          ],
        },
        fields: [
          {
            name: "hotelOwnerName",
            label: "Hotel Owner Name",
            type: "text",
            required: true,
          },
          {
            name: "managementCompanyName",
            label: "Management Company Name",
            type: "text",
            required: true,
          },
          {
            name: "hotelLocation",
            label: "Hotel Location",
            type: "text",
            required: true,
          },
          {
            name: "compensation",
            label: "Compensation",
            type: "text",
            required: true,
          },
          {
            name: "agreementDuration",
            label: "Duration of Agreement",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Consulting Agreement",
        slug: "consulting-agreement",
        description: {
          summary:
            "A Consulting Agreement is a legal contract between a consultant and a client that outlines the scope of work, compensation, and other terms for the provision of consulting services.",
          details: [
            "Names and addresses of both parties.",
            "Scope of consulting services.",
            "Consultant’s fees and payment schedule.",
            "Duration of the agreement.",
            "Confidentiality and non-disclosure terms.",
            "Intellectual property ownership.",
            "Termination conditions.",
          ],
        },
        fields: [
          {
            name: "consultantName",
            label: "Consultant Name",
            type: "text",
            required: true,
          },
          {
            name: "clientName",
            label: "Client Name",
            type: "text",
            required: true,
          },
          {
            name: "scopeOfWork",
            label: "Scope of Work",
            type: "text",
            required: true,
          },
          {
            name: "consultantFee",
            label: "Consultant Fee",
            type: "number",
            required: true,
          },
          {
            name: "paymentSchedule",
            label: "Payment Schedule",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Internship Agreement",
        slug: "internship-agreement",
        description: {
          summary:
            "An internship agreement is a legal document that establishes the terms and conditions of an internship, including the intern's role, responsibilities, compensation, and duration.",
          details: [
            "Names and addresses of both parties.",
            "Internship position and description.",
            "Duration and start date of the internship.",
            "Intern's compensation (if any).",
            "Duties and responsibilities.",
            "Confidentiality terms.",
            "Termination conditions.",
          ],
        },
        fields: [
          {
            name: "internName",
            label: "Intern Name",
            type: "text",
            required: true,
          },
          {
            name: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
          },
          {
            name: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
          },
          { name: "duration", label: "Duration", type: "text", required: true },
          {
            name: "compensation",
            label: "Compensation",
            type: "text",
            required: false,
          },
        ],
      },
      {
        name: "Work for Hire Contract",
        slug: "work-for-hire-contract",
        description: {
          summary:
            "A Work for Hire contract is a legal agreement where a worker (often a freelancer or contractor) agrees to create work (such as a written document, design, or software) for a company, and the company owns all rights to the work upon completion.",
          details: [
            "Names and addresses of both parties.",
            "Description of work to be created.",
            "Payment terms and compensation.",
            "Ownership of work created.",
            "Duration of agreement.",
            "Confidentiality and intellectual property rights.",
          ],
        },
        fields: [
          {
            name: "workerName",
            label: "Worker Name",
            type: "text",
            required: true,
          },
          {
            name: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
          },
          {
            name: "workDescription",
            label: "Work Description",
            type: "text",
            required: true,
          },
          {
            name: "paymentAmount",
            label: "Payment Amount",
            type: "number",
            required: true,
          },
          {
            name: "deliveryDate",
            label: "Delivery Date",
            type: "date",
            required: true,
          },
        ],
      },
      {
        name: "Software License Agreement",
        slug: "software-license-agreement",
        description: {
          summary:
            "This is a legal document that outlines the terms and conditions under which a software program or application can be used and serves as a contract between the software creator and the person or company using the software, known as the Licensee.",
          details: [
            "Parties to the Agreement",
            "Definitions",
            "Grant of License",
            "License Restrictions",
            "Fees and Payment",
            "Intellectual Property Rights",
            "Warranties and Representations",
            "Support and Maintenance",
            "Confidentiality",
            "Limitation of Liability",
            "Term and Termination",
            "Governing Law and Jurisdiction",
            "Miscellaneous Provisions",
          ],
        },
        fields: [
          {
            name: "licensorName",
            label: "Licensor Name",
            type: "text",
            required: true,
          },
          {
            name: "licenseeName",
            label: "Licensee Name",
            type: "text",
            required: true,
          },
          {
            name: "softwareName",
            label: "Software Name",
            type: "text",
            required: true,
          },
          {
            name: "licenseFee",
            label: "License Fee",
            type: "number",
            required: true,
          },
          {
            name: "licenseDuration",
            label: "License Duration",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Employee Non-Disclosure Agreement",
        slug: "employee-non-disclosure-agreement",
        description: {
          summary:
            "Also referred to as confidentiality agreement, Employee Non-Disclosure Agreement (NDA) is a legal contract between an employer and an employee. The NDA is designed to protect sensitive information pertaining to the business. When an employee signs an NDA, they agree not to disclose or share proprietary company information with third parties without proper authorization.",
          details: [
            "Definition of Confidential Information",
            "Obligations of the Employee",
            "Duration which the information must be kept confidential",
            "Exclusions",
            "Consequences of breach",
          ],
        },
        fields: [
          {
            name: "employeeName",
            label: "Employee Name",
            type: "text",
            required: true,
          },
          {
            name: "employerName",
            label: "Employer Name",
            type: "text",
            required: true,
          },
          {
            name: "confidentialityPeriod",
            label: "Confidentiality Period",
            type: "text",
            required: true,
          },
          {
            name: "breachConsequences",
            label: "Consequences of Breach",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Land Sale Agreement",
        slug: "land-sale-agreement",
        description: {
          summary:
            "A Land Sale Agreement is a contract between a seller and a buyer for the sale of land. It outlines the terms of the transaction, including payment, transfer of ownership, and any contingencies.",
          details: [
            "Names and addresses of both parties.",
            "Property details (location, size, boundaries).",
            "Sale price and payment terms.",
            "Deposit (if any).",
            "Conditions precedent (e.g., approval from authorities).",
            "Transfer of ownership.",
            "Completion date.",
          ],
        },
        fields: [
          {
            name: "sellerName",
            label: "Seller Name",
            type: "text",
            required: true,
          },
          {
            name: "buyerName",
            label: "Buyer Name",
            type: "text",
            required: true,
          },
          {
            name: "propertyDescription",
            label: "Property Description",
            type: "text",
            required: true,
          },
          {
            name: "salePrice",
            label: "Sale Price",
            type: "number",
            required: true,
          },
          {
            name: "completionDate",
            label: "Completion Date",
            type: "date",
            required: true,
          },
        ],
      },
      {
        name: "Lease Agreement",
        slug: "lease-agreement",
        description: {
          summary:
            "A Lease Agreement is a legally binding contract between a landlord and a tenant that sets out the terms and conditions for the rental of property. This agreement outlines the rights and responsibilities of both parties and ensures that both the landlord and the tenant are protected legally throughout the lease period.",
          details: [
            "Names and addresses of both parties.",
            "Property description (location, size, type of property).",
            "Lease term (start date and end date).",
            "Rent amount and payment schedule.",
            "Security deposit details.",
            "Responsibilities of the landlord (maintenance, repairs).",
            "Responsibilities of the tenant (paying rent, maintaining property).",
            "Termination conditions and notice period.",
            "Penalties for late payment or breach of agreement.",
            "Renewal terms (if applicable).",
          ],
        },
        fields: [
          {
            name: "landlordName",
            label: "Landlord Name",
            type: "text",
            required: true,
          },
          {
            name: "tenantName",
            label: "Tenant Name",
            type: "text",
            required: true,
          },
          {
            name: "propertyDescription",
            label: "Property Description",
            type: "text",
            required: true,
          },
          {
            name: "rentAmount",
            label: "Rent Amount",
            type: "number",
            required: true,
          },
          {
            name: "securityDeposit",
            label: "Security Deposit",
            type: "number",
            required: true,
          },
          {
            name: "leaseTerm",
            label: "Lease Term",
            type: "text",
            required: true,
          },
          {
            name: "paymentSchedule",
            label: "Payment Schedule",
            type: "text",
            required: true,
          },
          {
            name: "noticePeriod",
            label: "Notice Period for Termination",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  },
  {
    category: "Demand Letters",
    documents: [
      {
        name: "Demand for Fulfillment of Lease Agreement Obligations",
        slug: "demand-for-fulfillment-of-lease-agreement-obligations",
        description: {
          summary:
            "This letter serves as a formal letter to address breaches or non-compliance with the terms of a lease agreement. Typically used in landlord-tenant relationships when one party fails to meet their obligations.",
          details: [
            "Sender and Recipient Information",
            "Subject Line",
            "Reference to the Lease Agreement",
            "Details of the Breach",
            "Demands for Action",
            "Consequences of Non-Compliance",
            "Signatures",
          ],
        },
        fields: [
          {
            name: "senderName",
            label: "Sender's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "senderAddress",
            label: "Sender's Address",
            type: "text",
            required: true,
          },
          {
            name: "recipientName",
            label: "Recipient's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "recipientAddress",
            label: "Recipient's Address",
            type: "text",
            required: true,
          },
          {
            name: "leaseAgreementDate",
            label: "Date of Lease Agreement",
            type: "date",
            required: true,
          },
          {
            name: "breachDetails",
            label: "Details of the Breach",
            type: "textarea",
            required: true,
          },
          {
            name: "demandAction",
            label: "Action Demanded",
            type: "textarea",
            required: true,
          },
        ],
      },
      {
        name: "Demand Letter for Reinstatement of Employment ",
        slug: "demand-letter-for-reinstatement-of-employment",
        description: {
          summary:
            "This is a formal letter typically used by an employee in Kenya to request reinstatement to their position after being unfairly or unlawfully terminated.",
          details: [
            "Personal and Employer Details",
            "Subject Line",
            "Introduction",
            "Background of Termination",
            "Demand for Reinstatement",
            "Closing Statement",
            "Signature",
          ],
        },
        fields: [
          {
            name: "employeeName",
            label: "Employee's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "employeeAddress",
            label: "Employee's Address",
            type: "text",
            required: true,
          },
          {
            name: "employerName",
            label: "Employer's Name",
            type: "text",
            required: true,
          },
          {
            name: "employerAddress",
            label: "Employer's Address",
            type: "text",
            required: true,
          },
          {
            name: "terminationDate",
            label: "Date of Termination",
            type: "date",
            required: true,
          },
          {
            name: "terminationReason",
            label: "Reason for Termination",
            type: "textarea",
            required: true,
          },
          {
            name: "justification",
            label: "Why the termination was unfair/unlawful",
            type: "textarea",
            required: true,
          },
        ],
      },
      {
        name: "Demand Letter for Repair of Damaged Property.",
        slug: "demand-letter-for-repair-of-damaged-property",
        description: {
          summary:
            "A demand letter for repair of damaged property is a formal communication sent to an individual or entity responsible for damaging your property, clearly outlining the incident and demand for repair or compensation.",
          details: [
            "Sender's Information",
            "Recipient's Information",
            "Date",
            "Subject Line",
            "Description of the Incident",
            "Description of Damaged Property",
            "Demands: A specific request for action, such as immediate repair of the damaged property",
            "Legal Warning",
            "Closing Statement",
            "Signature",
            "Attachments: Supporting documents, such as photos of the damage, repair estimates or invoices e.t.c",
          ],
        },
        fields: [
          {
            name: "senderName",
            label: "Sender's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "senderAddress",
            label: "Sender's Address",
            type: "text",
            required: true,
          },
          {
            name: "recipientName",
            label: "Recipient's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "recipientAddress",
            label: "Recipient's Address",
            type: "text",
            required: true,
          },
          {
            name: "incidentDate",
            label: "Date of Incident",
            type: "date",
            required: true,
          },
          {
            name: "incidentDescription",
            label: "Description of Incident",
            type: "textarea",
            required: true,
          },
          {
            name: "damagedItems",
            label: "Damaged Property Description",
            type: "textarea",
            required: true,
          },
          {
            name: "demandAction",
            label: "Requested Action (e.g. repair, replacement)",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Demand Letter for Repayment of Loan",
        slug: "demand-letter-for-repayment-of-loan",
        description: {
          summary:
            "A Demand for Repayment of Loan is a formal letter/communication sent by a lender to a borrower, requesting the immediate repayment of a loan that is overdue.",
          details: [
            "Sender's Information",
            "Borrower's Information",
            "Date",
            "Subject Line",
            "Reference to Loan Agreement",
            "Description of the Loan",
            "Statement of Non-Payment",
            "Request for Immediate Repayment",
            "Consequences of Non-Compliance",
            "Closing Statement",
            "Sender's Signature",
          ],
        },
        fields: [
          {
            name: "lenderName",
            label: "Lender's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "lenderAddress",
            label: "Lender's Address",
            type: "text",
            required: true,
          },
          {
            name: "borrowerName",
            label: "Borrower's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "borrowerAddress",
            label: "Borrower's Address",
            type: "text",
            required: true,
          },
          {
            name: "loanAmount",
            label: "Loan Amount",
            type: "number",
            required: true,
          },
          {
            name: "loanDate",
            label: "Date of Loan Agreement",
            type: "date",
            required: true,
          },
          {
            name: "dueDate",
            label: "Due Date for Repayment",
            type: "date",
            required: true,
          },
          {
            name: "paymentStatus",
            label: "Statement on Non-Payment",
            type: "textarea",
            required: true,
          },
        ],
      },
      {
        name: "Demand Letter for Breach of Contract",
        slug: "demand-letter-for-breach-of-contract",
        description: {
          summary:
            "A demand letter for breach of contract is a formal written communication sent by the aggrieved party to the defaulting party, notifying them of their failure to fulfill contractual obligations and requesting remedial action.",
          details: [
            "Sender's Information",
            "Recipient's Information",
            "Date",
            "Subject Line",
            "Reference to the contract",
            "Details of the Breach",
            "Consequences of the Breach",
            "Demands for Remedy",
            "Legal Warning",
            "Closing Statement",
            "Signature",
            "Attachments e.g. Copy of the contract",
          ],
        },
        fields: [
          {
            name: "senderName",
            label: "Sender's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "senderAddress",
            label: "Sender's Address",
            type: "text",
            required: true,
          },
          {
            name: "recipientName",
            label: "Recipient's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "recipientAddress",
            label: "Recipient's Address",
            type: "text",
            required: true,
          },
          {
            name: "contractDate",
            label: "Date of Contract",
            type: "date",
            required: true,
          },
          {
            name: "contractDetails",
            label: "Contract Reference/Description",
            type: "textarea",
            required: true,
          },
          {
            name: "breachDetails",
            label: "Description of the Breach",
            type: "textarea",
            required: true,
          },
          {
            name: "demandRemedy",
            label: "Demanded Remedy",
            type: "textarea",
            required: true,
          },
        ],
      },
      {
        name: "Demand Letter for Unpaid Salary",
        slug: "demand-letter-for-unpaid-salary",
        description: {
          summary:
            "A Demand Letter for Payment of Unpaid Salary is a formal letter sent by an employee to their employer to request the payment of salary that is overdue.",
          details: [
            "Employee's Information",
            "Employer's Information",
            "Date",
            "Subject Line",
            "Reference to the Employment Agreement",
            "Details of unpaid Salary",
            "Statement of the Issue",
            "Formal Request for Payment",
            "Legal Consequences for Non-Compliance",
            "Closing Remarks",
            "Employee's Signature",
          ],
        },
        fields: [
          {
            name: "employeeName",
            label: "Employee's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "employeeAddress",
            label: "Employee's Address",
            type: "text",
            required: true,
          },
          {
            name: "employerName",
            label: "Employer's Name",
            type: "text",
            required: true,
          },
          {
            name: "employerAddress",
            label: "Employer's Address",
            type: "text",
            required: true,
          },
          {
            name: "unpaidAmount",
            label: "Total Unpaid Salary",
            type: "number",
            required: true,
          },
          {
            name: "periodUnpaid",
            label: "Period of Unpaid Salary",
            type: "text",
            required: true,
          },
        ],
      },
      {
        name: "Rent Arrears Demand Letter ",
        slug: "rent-arrears-demand-letter",
        description: {
          summary:
            "A Rent Arrears Demand Letter is formal communiction from the landlord to the tenant which indicates that the tenant has failed to pay rent on thime and has fallen into arrears.",
          details: [
            "Date of writing the letter",
            "Landlord's information",
            "Tenant's information",
            "Subject Line",
            "Salutation",
            "Brief introduction stating the purpose of the letter",
            "Details of the arrears e.g. Amount Due, Rental Period",
            "Reference to the lease agreement",
            "Demand for payment",
            "Consequences for non-payment",
            "Payment instructions",
          ],
        },
        fields: [
          {
            name: "landlordName",
            label: "Landlord's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "landlordAddress",
            label: "Landlord's Address",
            type: "text",
            required: true,
          },
          {
            name: "tenantName",
            label: "Tenant's Full Name",
            type: "text",
            required: true,
          },
          {
            name: "tenantAddress",
            label: "Tenant's Address",
            type: "text",
            required: true,
          },
          {
            name: "rentAmountDue",
            label: "Amount Due",
            type: "number",
            required: true,
          },
          {
            name: "rentalPeriod",
            label: "Rental Period Covered by Arrears",
            type: "text",
            required: true,
          },
          {
            name: "paymentInstructions",
            label: "Payment Instructions",
            type: "textarea",
            required: true,
          },
        ],
      },
    ],
  },
];
