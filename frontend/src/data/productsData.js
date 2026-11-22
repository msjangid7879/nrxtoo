export const PRODUCTS_DATA = [
  {
    slug: 'shop-inventory',
    title: 'Shop & Inventory',
    subtitle: 'Jewellery & Stones Dynamic Inventory Engine',
    tagline: 'Hallmark HUID Gold, Certified Gemstones, Purchase/Sale Billing & CAD Quotations',
    badge: 'Core Engine',
    category: 'Vault & Showroom',
    accentColor: 'from-amber-600 to-amber-800',
    iconName: 'Gem',
    stats: [
      { label: 'Hallmark Compliance', value: '100% BIS HUID' },
      { label: 'Category Engine', value: 'Dynamic Specs' },
      { label: 'Stock Reconciliation', value: 'Instant & Real-Time' },
      { label: 'CAD Workflow', value: 'Quotation-to-Delivery' },
    ],
    overview:
      'The central nervous system for precious jewellery and gemstone merchants. Manage raw bullion lots, finished hallmarked 22K/18K/14K jewellery, loose diamonds with 4Cs, and certified colored gemstones with zero ambiguity. Features tailored category workflows for jewellery and stones, synchronized counter stock movements, purchase and sales vouchers, and a complete custom CAD design & quotation approval lifecycle.',
    keyFeatures: [
      {
        title: 'Dynamic Jewellery Specifications',
        description:
          'Dedicated attributes tailored specifically to gold, platinum, and silver jewellery: metal type, hallmark purity (24K, 22K 916, 18K 750, 14K, 925 Sterling, 950 Platinum), gross weight, net weight, stone weight, making charges (flat or per gram), and mandatory 6-character alphanumeric BIS HUID hallmark tracking.',
        icon: 'Sparkles',
      },
      {
        title: 'Dynamic Precious Stones Specifications',
        description:
          'Comprehensive gemstone attributes for diamonds and colored stones: stone type (Diamond, Ceylon Blue Sapphire, Colombian Emerald, Burmese Ruby, etc.), shape & cut (Round Brilliant, Cushion, Princess, Octagonal), color grade, clarity (FL, IF, VVS1-VVS2, VS1-VS2), carat weight, natural/unheated treatment origin, and laboratory certificate numbers (GIA, IGI, SGL, GRS).',
        icon: 'Award',
      },
      {
        title: 'Real-Time Purchases, Sales & Approval Workflows',
        description:
          'Inward bullion procurement and supplier lot purchases automatically increment vault stock, while counter sales bills decrement stock with concurrency protection. Includes approval workflows for vault inventory transfers, scrap bullion melt conversions, and supervisor price overrides.',
        icon: 'ArrowDownLeft',
      },
      {
        title: 'CAD Design & Custom Quotation Lifecycle',
        description:
          'Track bespoke client commissions from initial hand sketch to 3D CAD render uploads, metal weight estimation, wax tree casting, and quotation generation. Monitor real-time status: In CAD Modeling, Customer Quotation Approved, In Karigar Workshop, Hallmarking, or Ready for Delivery.',
        icon: 'FileText',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Select Category & Dynamic Template',
        description:
          'Choose between "Jewellery" or "Stones". The input form dynamically presents hallmark metal fields or gemological 4C certificate fields without cluttered irrelevant inputs.',
      },
      {
        step: '02',
        title: 'Log Vault Entry with HUID or Certificate',
        description:
          'Assign unique SKU, capture weights down to 3 decimal places (0.001g or 0.001ct), upload showroom photos, and link official BIS HUID or GIA lab certificate numbers.',
      },
      {
        step: '03',
        title: 'Procure Bullion or Execute Counter Sale',
        description:
          'Record purchases from bullion refineries or issue retail counter sales. Vault stock quantities and showroom valuation update in real time with complete audit trails.',
      },
      {
        step: '04',
        title: 'Manage Bespoke Orders & Quotations',
        description:
          'Attach 3D CAD files and diamond grading sheets to custom quotation vouchers, track artisan goldsmith progress, and convert into final invoices upon customer sign-off.',
      },
    ],
    specifications: [
      { spec: 'Supported Metals', detail: '24K, 22K (916), 18K (750), 14K (585) Yellow/White/Rose Gold, 950 Platinum, 925 Sterling Silver' },
      { spec: 'Weight Precision', detail: 'Milligram accuracy (0.001 grams) for bullion & 3-decimal carats (0.001 ct) for stones' },
      { spec: 'Regulatory Compliance', detail: 'BIS Hallmarking (HUID), GIA, IGI, SGL certificate validation' },
      { spec: 'CAD & Design File Formats', detail: 'STL, OBJ, 3DM (Rhino), JPEG, PNG, PDF design sketches & 3D renders' },
    ],
  },
  {
    slug: 'hr-clients',
    title: 'Admin, HR & Clients',
    subtitle: 'Hierarchical Staff Management, Boutique Operations & VIP Client CRM',
    tagline: 'Multi-Tier Roles, Attendance, Payroll, Digital Gatepasses, Boutique Chats & Filtered VIP Catalogues',
    badge: 'HR & CRM Suite',
    category: 'Workforce & Client Relations',
    accentColor: 'from-indigo-600 to-indigo-800',
    iconName: 'Users',
    stats: [
      { label: 'Role Hierarchy', value: 'Admin, Sr HR, Jr HR, Staff' },
      { label: 'Security Gatepass', value: 'Digital QR Approvals' },
      { label: 'Private Catalogues', value: 'Time-Limited VIP Links' },
      { label: 'Team Communication', value: 'Real-Time Showroom Chat' },
    ],
    overview:
      'Purpose-built for luxury jewellery showrooms, ateliers, and bullion offices where security and discretion are paramount. Manage staff hierarchy across Admin, Senior HR, Junior HR, and Counter Staff with strict permission controls. Handle biometric attendance, salary payroll, leave tracking, and secure digital gatepasses for high-value jewellery taken outside the vault. Plus, empower your sales staff with internal chat and custom-curated, password-protected private catalogue links for high-net-worth VIP clients.',
    keyFeatures: [
      {
        title: 'Hierarchical Role-Based Access Control',
        description:
          'Distinct permission tiers separating Directors/Admins, Senior HR (payroll & staff onboarding), Junior HR (attendance & roster), and Counter Staff (sales and billing). Every staff member logs in securely with their own User ID without sharing master passwords.',
        icon: 'Shield',
      },
      {
        title: 'Attendance, Salary Payroll & Leave Tracking',
        description:
          'Automated attendance tracking for shifts, daily sales staff incentives, commission calculations on stone margins, monthly salary slip generation, and digital leave request approvals.',
        icon: 'Calendar',
      },
      {
        title: 'Digital Gatepass System for Vault Assets',
        description:
          'Eliminate handwritten paper chits when valuable items leave the showroom for photo shoots, customer home trials, artisan repairs, or hallmarking center drop-offs. Generate digital gatepasses with time limits, authorization signatures, and status logging.',
        icon: 'BadgeCheck',
      },
      {
        title: 'Filtered Private Catalogue Links for Offline Clients',
        description:
          'Curate custom product selections for high-value walk-in or offline telephone VIP customers. Filter your vault by budget, stone cut, or gold karatage, and generate an exclusive, expiring web link displaying only those pieces without revealing wholesale margins.',
        icon: 'Lock',
      },
      {
        title: 'Showroom & Team Communication Chat',
        description:
          'Built-in internal messaging allows floor sales consultants to privately check with vault custodians, request manager approval on custom discounts, and coordinate without leaving the counter.',
        icon: 'MessageSquare',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Define Roles & Issue Unique User IDs',
        description:
          'Admins and Senior HR create team accounts, configure granular permissions, and provide staff with simple, memorable User IDs (e.g. senior_hr, staff_kavita) without exposing personal emails.',
      },
      {
        step: '02',
        title: 'Track Daily Operations & Attendance',
        description:
          'Staff log in daily to record sales and attendance. Managers oversee leave calendars, shift allocations, and performance incentives linked directly to counter sales.',
      },
      {
        step: '03',
        title: 'Issue Digital Gatepasses for Transit',
        description:
          'When jewellery is taken for outside hallmarking or VIP customer viewing, Senior HR or Admin issues a logged digital gatepass with security checkpoints.',
      },
      {
        step: '04',
        title: 'Generate VIP Client Private Catalogues',
        description:
          'Sales executives select tailored inventory items, click "Generate VIP Client Link", set an expiration period (e.g. 48 hours), and WhatsApp or email the private boutique showcase directly to the customer.',
      },
    ],
    specifications: [
      { spec: 'Supported Role Levels', detail: 'Director/Admin, Senior HR, Junior HR, Showroom Staff, Karigar Liaison' },
      { spec: 'Client Privacy Control', detail: 'Expiring URLs, tokenized access, hidden cost prices, custom client greeting' },
      { spec: 'Payroll Features', detail: 'Base salary, sales commissions, overtime, bullion margin bonuses, deductions' },
      { spec: 'Security Logs', detail: 'Full IP & timestamp audit trail on user creation, role changes, and gatepass issuance' },
    ],
  },
  {
    slug: 'accounting-billing',
    title: 'Accounting & Billing',
    subtitle: 'Fiscal Compliance, GST Invoicing & International Bullion Logistics',
    tagline: 'GST Split Calculations, Retail Bills, Wholesale Invoices, Delivery Challans, E-Way Bills & Export Invoicing with HSN',
    badge: 'Fiscal Ledger',
    category: 'Finance & Compliance',
    accentColor: 'from-emerald-600 to-emerald-800',
    iconName: 'Receipt',
    stats: [
      { label: 'GST Compliance', value: 'Auto CGST/SGST/IGST' },
      { label: 'E-Way Bill', value: 'Instant Digital Ready' },
      { label: 'Export Support', value: 'Multi-Currency & HSN' },
      { label: 'Voucher Types', value: 'Bill, Invoice, Challan' },
    ],
    overview:
      'A comprehensive fiscal ledger engineered specifically for the taxation intricacies of the bullion, fine jewellery, and gemstone industry. Accurately separate 3% GST on precious metals, differential tax on making charges, 1.5% on cut & polished diamonds, and 0.25% on rough stones. Generate retail cash memos, B2B wholesale tax invoices, artisan delivery challans, automated E-Way bills for road transit, and international export invoices with accurate Harmonized System (HSN) codes in any global currency.',
    keyFeatures: [
      {
        title: 'Automated Jewellery GST Tax Calculation',
        description:
          'Intelligent tax engine automatically handles intra-state CGST + SGST (1.5% + 1.5% on gold/platinum) and inter-state IGST (3%), separating metal bullion value from service GST (5% or 18% on craftsmanship labor). Generates monthly GSTR-1 and GSTR-3B audit summaries.',
        icon: 'TrendingUp',
      },
      {
        title: 'Retail Bills, Wholesale Invoices & Cash Memos',
        description:
          'Print branded tax invoices with QR codes, HUID hallmark numbers, terms of exchange, and payment breakdown (Cash, Card, UPI, Bank Transfer, or Old Gold Bullion Exchange).',
        icon: 'Receipt',
      },
      {
        title: 'Delivery Challans for Karigars & Exhibitions',
        description:
          'Generate official GST Delivery Challans (Rule 55) for moving raw bullion to goldsmith workshops (karigars) for manufacturing, or moving curated collections to domestic trade exhibitions and pop-up shows without triggering deemed sales.',
        icon: 'Truck',
      },
      {
        title: 'Integrated E-Way Bill Generation',
        description:
          'Seamlessly generate Electronic Way Bills for high-value consignments moving across state lines. Complies with the mandatory e-way bill threshold for precious cargo with automated consignment number logging.',
        icon: 'FileText',
      },
      {
        title: 'Export Invoices with HSN Codes & Multi-Currency',
        description:
          'Export hallmarked jewellery and loose gems worldwide with international commercial invoices. Automatically populates correct 6-digit and 8-digit HSN codes (e.g., 7113 for Gold Jewellery, 7102 for Diamonds, 7103 for Precious Gemstones, 7106 for Silver) and converts to USD, EUR, GBP, or AED with foreign exchange notes.',
        icon: 'Globe',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Initiate Sale or Wholesale Order',
        description:
          'Pull inventory items directly from the vault into the billing terminal. The system automatically fetches current stock price, net weight, making charges, and hallmarking fees.',
      },
      {
        step: '02',
        title: 'Dynamic Tax & Bullion Exchange Split',
        description:
          'If the customer exchanges old gold, enter scrap weight and purity. The system calculates net payable amount and applies GST strictly to the net value according to tax regulations.',
      },
      {
        step: '03',
        title: 'Generate Invoice, Challan or E-Way Bill',
        description:
          'Select document type: Retail Tax Invoice, B2B Commercial Invoice, Job-Work Delivery Challan, or E-Way Bill for road transit. Instantly download or print high-resolution PDF.',
      },
      {
        step: '04',
        title: 'Reconcile General Ledger & Export Reports',
        description:
          'All revenue, tax liabilities, and accounts receivable sync in real-time. Export accounting journals and GST filing summaries to Excel or CSV for your chartered accountant.',
      },
    ],
    specifications: [
      { spec: 'Supported HSN Chapters', detail: 'Chapter 71: 7102 (Diamonds), 7103 (Gemstones), 7106 (Silver), 7108 (Gold), 7113 (Jewellery)' },
      { spec: 'Currencies Supported', detail: 'INR (₹), USD ($), EUR (€), GBP (£), AED (AED), SGD (S$)' },
      { spec: 'Voucher Output Formats', detail: 'Thermal 3-inch slip, A4 Executive Print, A5 Bill Book, Digitally signed PDF with QR' },
      { spec: 'Tax Breakdown', detail: 'Multi-rate line items: Bullion (3%), Diamonds (1.5%), Making Charges (5%/18%)' },
    ],
  },
  {
    slug: 'ecommerce',
    title: 'Online Shop & E-Commerce',
    subtitle: 'Branded Customer Storefront, Bespoke Orders & Parcel Tracking',
    tagline: 'Dedicated Public Boutique URL, Live Catalog Sync, Custom Design Commissioning & Global Courier Tracking like Etsy',
    badge: 'Online Storefront',
    category: 'E-Commerce & Digital Boutique',
    accentColor: 'from-rose-600 to-rose-800',
    iconName: 'ShoppingBag',
    stats: [
      { label: 'Public Web Store', value: 'Dedicated Subdomain' },
      { label: 'Custom Orders', value: 'Bespoke Request Portal' },
      { label: 'Manufacturing Timeline', value: 'Live Step-by-Step' },
      { label: 'Parcel Tracking', value: 'BlueDart / Sequel / Etsy-style' },
    ],
    overview:
      'Transform your brick-and-mortar jewellery boutique into a global luxury e-commerce brand. Every boutique gets a high-performance, 256-bit SSL encrypted storefront displaying live inventory with hallmark details and certification badges. Beyond standard cart checkout, customers can submit Bespoke Custom Design Requests with photos and custom metal preferences. Customers receive transparent, live manufacturing updates through every atelier stage and third-party courier tracking akin to Etsy and Net-a-Porter.',
    keyFeatures: [
      {
        title: 'Dedicated Public Storefront URL',
        description:
          'Launch your online boutique instantly at https://store.nrxtoo.com/:shopSlug with customizable logo, hero banner, brand story, and contact details. Fully responsive for luxury mobile shoppers.',
        icon: 'Globe',
      },
      {
        title: 'Live Synchronized Catalogue & Safe Checkout',
        description:
          'Products published from your Shop & Inventory module sync in real-time. Sold pieces automatically show "Out of Stock" or "Made to Order" to prevent double-selling rare single-piece gemstone items.',
        icon: 'ShoppingBag',
      },
      {
        title: 'Bespoke Custom Design Request Portal',
        description:
          'Customers can upload dream sketches, Pinterest references, select preferred gold karatage (14K/18K/22K), diamond shapes, and budget range. Ateliers review requests, reply with 3D CAD models, and accept milestone advance deposits.',
        icon: 'Sparkles',
      },
      {
        title: 'Live Manufacturing Stage Tracker',
        description:
          'Build customer trust with an interactive progress timeline: Design Finalized -> 3D Resin Print -> Metal Casting -> Gemstone Setting -> BIS Laser Hallmarking -> Final Polish & Insured Packaged.',
        icon: 'Clock',
      },
      {
        title: 'Integrated Parcel Tracking (Etsy-Style)',
        description:
          'Real-time third-party parcel tracking integrated with top secure courier carriers (BlueDart Apex, Sequel Logistics, Malca-Amit, FedEx, Brink\'s). Customers receive tracking IDs, GPS transit milestones, and delivery confirmation OTPs.',
        icon: 'Truck',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Publish Items from Inventory with 1 Click',
        description:
          'Select any vault item in your inventory dashboard and toggle "Publish to Online Storefront". High-res images, hallmark purity, and gem certs appear live online instantly.',
      },
      {
        step: '02',
        title: 'Customers Browse & Place Orders',
        description:
          'Shoppers explore your collections, filter by metal, price, or gem, and place orders with secure online payment or opt for showroom click-and-collect.',
      },
      {
        step: '03',
        title: 'Receive Bespoke Inquiries & Share CAD Renders',
        description:
          'When customers submit custom requests, your CAD designer uploads 3D previews for customer approval before metal casting begins.',
      },
      {
        step: '04',
        title: 'Fulfill, Insure & Track Secure Delivery',
        description:
          'Dispatch items with insured logistics partners. The customer tracking portal updates with live courier checkpoints and estimated delivery dates.',
      },
    ],
    specifications: [
      { spec: 'Storefront URL', detail: 'https://store.nrxtoo.com/{shop-slug} with custom domain alias support' },
      { spec: 'Tracking Partners', detail: 'Sequel Secure, BlueDart Apex, Malca-Amit, FedEx, Brink\'s Insured Armored' },
      { spec: 'Custom Orders', detail: 'Image upload (JPG, PNG), ring sizer guide, budget selector, metal preference' },
      { spec: 'Customer Security', detail: 'End-to-end SSL 256-bit encryption, OTP delivery verification, certificate download' },
    ],
  },
  {
    slug: 'admin-access',
    title: 'Admin & Access Panel',
    subtitle: 'Boutique Privacy, Role Delegation & Showroom Security',
    tagline: 'Enterprise Granular Roles, Vault Permission Flags, Isolated Network Console & Complete Data Privacy',
    badge: 'Security & Privacy',
    category: 'System Administration',
    accentColor: 'from-purple-600 to-purple-800',
    iconName: 'ShieldCheck',
    stats: [
      { label: 'Boutique Privacy', value: '100% Strict Boundaries' },
      { label: 'Login Authentication', value: 'User ID + Password' },
      { label: 'Network Console', value: 'Dedicated Area' },
      { label: 'Permission Flags', value: 'Granular Matrix' },
    ],
    overview:
      'The administrative engine that guarantees bank-grade security and complete showroom data privacy. Assures boutique owners that their confidential client lists, bullion purchase rates, and staff salaries are strictly protected. Includes granular role definitions, module activation switches, and strict isolation between boutique operations and high-level platform administration.',
    keyFeatures: [
      {
        title: 'Strict Boutique Data Privacy & Isolation',
        description:
          'Every boutique’s items, customer transactions, and accounting records are strictly partitioned. No other business can ever view your inventory, financial figures, or customer lists.',
        icon: 'Lock',
      },
      {
        title: 'Granular Permission Flags & Delegation',
        description:
          'Define exactly what each employee can view, create, edit, or delete. Give billing staff access to record counter sales without showing supplier bullion procurement costs or shop bank balances.',
        icon: 'Sliders',
      },
      {
        title: 'Dedicated Network Administration Console',
        description:
          'Platform administration operates on a dedicated route protected by separate credentials, allowing system administrators to activate new boutique workspaces and configure services without viewing confidential jewellery margins.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Zero Email Login Architecture',
        description:
          'Boutique staff log in with unique User IDs (e.g. staff_kavita, senior_hr) rather than personal email accounts, reducing phishing risks and ensuring company credentials remain within showroom control.',
        icon: 'Users',
      },
      {
        title: 'Comprehensive Action Audit Logging',
        description:
          'Track every stock adjustment, price change, invoice deletion, and permission update with exact timestamp, user ID, and action details for internal vigilance and compliance.',
        icon: 'BarChart3',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Boutique Onboarding & Initial Setup',
        description:
          'The Shop Owner registers the boutique via the signup flow. The showroom is allocated a dedicated workspace and default module suite.',
      },
      {
        step: '02',
        title: 'Assign User IDs & Roles to Employees',
        description:
          'The boutique admin creates staff user accounts for Senior HR, Junior HR, Cashiers, and Sales Associates, granting specific module privileges.',
      },
      {
        step: '03',
        title: 'Manage Active Services & Workspaces',
        description:
          'Boutique admins configure active showroom modules, tailoring tools to counter sales, wholesale distribution, or online e-commerce.',
      },
      {
        step: '04',
        title: 'Audit Trails & Session Security',
        description:
          'All user logins and high-value vault actions are verified with encrypted security keys, guaranteeing transparent showroom accountability.',
      },
    ],
    specifications: [
      { spec: 'Authentication Model', detail: 'Encrypted Staff Session with User ID, boutique profile, and hierarchical role' },
      { spec: 'Data Protection', detail: 'Encrypted isolated vault partitions with complete data protection and automatic backups' },
      { spec: 'Administrative Console', detail: 'Dedicated network administration area for service activation' },
      { spec: 'Audit Retention', detail: 'Immutable transaction records and stock history logs' },
    ],
  },
];
