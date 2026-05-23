// ARTECO constants, configs, and domain data

export const SK = {
  objects: "haas:objects", locations: "haas:locations", clients: "haas:clients",
  movements: "haas:movements", packages: "haas:packages", spaces: "haas:spaces", brand: "haas:brand",
  quotes: "haas:quotes", projects: "haas:projects", tasks: "haas:tasks",
  team: "haas:team", fleet: "haas:fleet", equipment: "haas:equipment", materials: "haas:materials", vendors: "haas:vendors", invoices: "haas:invoices",
  agents: "haas:agents", brandName: "haas:brandName", terms: "haas:terms",
  catalog: "haas:catalog", glLabels: "haas:glLabels", role: "haas:role", leads: "haas:leads", notifications: "haas:notifications", currentUser: "haas:currentUser", storageAccts: "haas:storageAccts",
  seeded: "haas:seeded_v40",
  imgs: (id) => "haas:imgs:" + id,
};

export const CATEGORIES = ["Painting", "Sculpture", "Work on Paper", "Photograph", "Furniture", "Antiquity", "Decorative Art", "Installation", "Other"];
export const SERVICE_GROUPS = [
  { key: "LOCAL-DXB", label: "Local \u2014 Dubai" },
  { key: "LOCAL-ROW", label: "Local \u2014 Rest of World" },
  { key: "STORAGE", label: "Storage & Inventory" },
  { key: "EXPORT-DXB", label: "Export Customs \u2014 Dubai" },
  { key: "EXPORT-ROW", label: "Export Customs \u2014 ROW" },
  { key: "EXPORT-AIR-DXB", label: "Export Air \u2014 Dubai" },
  { key: "EXPORT-AIR-ROW", label: "Export Air \u2014 ROW" },
  { key: "EXPORT-SEA-DXB", label: "Export Sea \u2014 Dubai" },
  { key: "EXPORT-SEA-ROW", label: "Export Sea \u2014 ROW" },
  { key: "FREIGHT-INBOUND", label: "Freight \u2014 Inbound" },
  { key: "FREIGHT-OUTBOUND", label: "Freight \u2014 Outbound" },
  { key: "INSURANCE", label: "Insurance" },
  { key: "IMPORT-DXB", label: "Import Customs \u2014 Dubai" },
  { key: "IMPORT-ROW", label: "Import Customs \u2014 ROW" },
  { key: "IMPORT-AIR-DXB", label: "Import Air \u2014 Dubai" },
  { key: "IMPORT-AIR-ROW", label: "Import Air \u2014 ROW" },
  { key: "IMPORT-SEA-DXB", label: "Import Sea \u2014 Dubai" },
  { key: "IMPORT-SEA-ROW", label: "Import Sea \u2014 ROW" },
  { key: "FAIR - ART DUBAI", label: "Fair \u2014 Art Dubai" },
  { key: "FAIR - ROW", label: "Fair \u2014 ROW" },
  { key: "DISCOUNT", label: "Discount" },
  { key: "THIRD PARTY", label: "Third-party Pricing" },
];
export const SERVICES = [
  { id: "local-dxb-collection", group: "LOCAL-DXB", code: "COLLECTION", label: "Collection from one address in Dubai and transport to our warehouse", unit: "Each", rate: 850.0, min: 0.0, vat: true },
  { id: "local-dxb-delivery", group: "LOCAL-DXB", code: "DELIVERY", label: "Delivery to one address in Dubai (City Limits), inlc. unloading", unit: "Each", rate: 850.0, min: 0.0, vat: true },
  { id: "local-dxb-collection-other-emirates", group: "LOCAL-DXB", code: "COLLECTION OTHER EMIRATES", label: "Collection from another emirate and transport to our warehouse", unit: "Each", rate: 1250.0, min: 0.0, vat: true },
  { id: "local-dxb-delivery-other-emirates", group: "LOCAL-DXB", code: "DELIVERY OTHER EMIRATES", label: "Delivery to one address in another emirate inlc. unloading", unit: "Each", rate: 1250.0, min: 0.0, vat: true },
  { id: "local-dxb-add-collection-address", group: "LOCAL-DXB", code: "ADD. COLLECTION ADDRESS", label: "Collection from one additional address in Dubai (City Limits)", unit: "Each", rate: 200.0, min: 0.0, vat: true },
  { id: "local-dxb-add-delivery-address", group: "LOCAL-DXB", code: "ADD. DELIVERY ADDRESS", label: "Delivery to one additional address in Dubai (City Limits)", unit: "Each", rate: 200.0, min: 0.0, vat: true },
  { id: "local-dxb-local-transport-d2d", group: "LOCAL-DXB", code: "LOCAL TRANSPORT D2D", label: "Transport with dedicated fine art truck, incl.. loading and unloading", unit: "Each", rate: 1000.0, min: 0.0, vat: true },
  { id: "local-dxb-transport-emirates-d2d", group: "LOCAL-DXB", code: "TRANSPORT EMIRATES D2D", label: "Transport with dedicated fine art truck between emirates, incl.. loading and unloading", unit: "Each", rate: 1500.0, min: 0.0, vat: true },
  { id: "local-dxb-loading", group: "LOCAL-DXB", code: "LOADING", label: "Loading and Stuffing (xx Men, xx Hours)", unit: "Hour", rate: 85.0, min: 0.0, vat: true },
  { id: "local-dxb-offloading", group: "LOCAL-DXB", code: "OFFLOADING", label: "Offloading (xx Men, xx Hours)", unit: "Hour", rate: 85.0, min: 0.0, vat: true },
  { id: "local-dxb-forklift", group: "LOCAL-DXB", code: "FORKLIFT", label: "Forklift Charges", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "local-dxb-crane", group: "LOCAL-DXB", code: "CRANE", label: "Crane Charges", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "local-dxb-packing", group: "LOCAL-DXB", code: "PACKING", label: "Soft-Packing of xxx items (xx Men x xx Hours)", unit: "Each", rate: 85.0, min: 170.0, vat: true },
  { id: "local-dxb-packing-material", group: "LOCAL-DXB", code: "PACKING MATERIAL", label: "Packing Materials", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "local-dxb-crating", group: "LOCAL-DXB", code: "CRATING", label: "Construction of xx crate(s) (dims: yy x yy x yy cm)", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "local-dxb-unpacking", group: "LOCAL-DXB", code: "UNPACKING", label: "Unpacking and removal of debris (xx men x xx hours)", unit: "Hour", rate: 85.0, min: 170.0, vat: true },
  { id: "local-dxb-w-h-handling-in", group: "LOCAL-DXB", code: "W/H HANDLING (IN)", label: "Warehouse Handling (IN)", unit: "CBM", rate: 55.0, min: 70.0, vat: true },
  { id: "local-dxb-w-h-handling-out", group: "LOCAL-DXB", code: "W/H HANDLING (OUT)", label: "Warehouse Handling (OUT)", unit: "CBM", rate: 55.0, min: 70.0, vat: true },
  { id: "local-dxb-w-h-handling-in-out", group: "LOCAL-DXB", code: "W/H HANDLING (IN/OUT)", label: "Warehouse Handling (In/OUT)", unit: "CBM", rate: 110.0, min: 70.0, vat: true },
  { id: "local-dxb-gate-pass-in", group: "LOCAL-DXB", code: "GATE PASS (IN)", label: "Entry Gate Pass Fee", unit: "Each", rate: 175.0, min: 0.0, vat: true },
  { id: "local-dxb-gate-pass-out", group: "LOCAL-DXB", code: "GATE PASS (OUT)", label: "Exit Gate Pass Fee", unit: "Each", rate: 175.0, min: 0.0, vat: true },
  { id: "local-dxb-installation", group: "LOCAL-DXB", code: "INSTALLATION", label: "Installation Services xx Art Handlers x xx Hours) - xx hrs", unit: "Hour", rate: 85.0, min: 170.0, vat: true },
  { id: "local-dxb-overtime-50", group: "LOCAL-DXB", code: "OVERTIME 50%", label: "50% Overtime Surcharge (xx Art Handlers, from xxxx to xxxx) xx hrs", unit: "Hour", rate: 112.5, min: 0, vat: true },
  { id: "local-dxb-overtime-100", group: "LOCAL-DXB", code: "OVERTIME 100%", label: "100% Overtime Surcharge (xx Art Handlers, from xxxx to xxxx) xx hrs", unit: "Hour", rate: 150.0, min: 0, vat: true },
  { id: "local-dxb-crate-disposal", group: "LOCAL-DXB", code: "CRATE DISPOSAL", label: "Crate Disposal", unit: "Crate", rate: 200.0, min: 0, vat: false },
  { id: "local-dxb-condition-reporting", group: "LOCAL-DXB", code: "CONDITION REPORTING", label: "Condition Reporting (xx Artworks)", unit: "Artwork", rate: 75.0, min: 0, vat: true },
  { id: "local-dxb-viewing-room", group: "LOCAL-DXB", code: "VIEWING ROOM", label: "Viewing Room Rental / Cataloguing / Photography (xx hours)", unit: "Hour", rate: 350.0, min: 700.0, vat: true },
  { id: "local-dxb-documentation", group: "LOCAL-DXB", code: "DOCUMENTATION", label: "Documentation & Communication", unit: "Each", rate: 250.0, min: 0, vat: true },
  { id: "local-row-collection", group: "LOCAL-ROW", code: "COLLECTION", label: "Collection from one address in xxx and transport to Warehouse", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-delivery", group: "LOCAL-ROW", code: "DELIVERY", label: "Delivery to one address in xxx (City Limits), inlc. unloading", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-add-collection-address", group: "LOCAL-ROW", code: "ADD. COLLECTION ADDRESS", label: "Collection from one additional address in xxx (City Limits)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-add-delivery-address", group: "LOCAL-ROW", code: "ADD. DELIVERY ADDRESS", label: "Delivery to one additional address in xxxx (City Limits)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-local-transport-d2d", group: "LOCAL-ROW", code: "LOCAL TRANSPORT D2D", label: "Transport with dedicated fine art truck, incl.. loading and unloading", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-loading", group: "LOCAL-ROW", code: "LOADING", label: "Loading and Stuffing (xx Men, xx Hours)", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-offloading", group: "LOCAL-ROW", code: "OFFLOADING", label: "Offloading (xx Men, xx Hours)", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-forklift", group: "LOCAL-ROW", code: "FORKLIFT", label: "Forklift Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-crane", group: "LOCAL-ROW", code: "CRANE", label: "Crane Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-packing", group: "LOCAL-ROW", code: "PACKING", label: "Soft-Packing of xxx items (xx Men x xx Hours)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-packing-material", group: "LOCAL-ROW", code: "PACKING MATERIAL", label: "Packing Materials", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-crating", group: "LOCAL-ROW", code: "CRATING", label: "Construction of xx crate(s) (dims: cc x cc x cc cm)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-unpacking", group: "LOCAL-ROW", code: "UNPACKING", label: "Unpacking and removal of debris (xx men x xx hours)", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-w-h-handling-in", group: "LOCAL-ROW", code: "W/H HANDLING (IN)", label: "Warehouse Handling (IN)", unit: "CBM", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-w-h-handling-out", group: "LOCAL-ROW", code: "W/H HANDLING (OUT)", label: "Warehouse Handling (OUT)", unit: "CBM", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-w-h-handling-in-out", group: "LOCAL-ROW", code: "W/H HANDLING (IN/OUT)", label: "Warehouse Handling (In/OUT)", unit: "CBM", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-installation", group: "LOCAL-ROW", code: "INSTALLATION", label: "Installation Services xx Art Handlers x xx Hours) - xx hrs", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-overtime", group: "LOCAL-ROW", code: "OVERTIME", label: "xx % Overtime Surcharge (xx Art Handlers, from xxxx to xxxx) xx hrs", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-condition-reporting", group: "LOCAL-ROW", code: "CONDITION REPORTING", label: "Condition Reporting (xx Artworks)", unit: "Artwork", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-crate-disposal", group: "LOCAL-ROW", code: "CRATE DISPOSAL", label: "Crate Disposal", unit: "Crate", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-viewing-room", group: "LOCAL-ROW", code: "VIEWING ROOM", label: "Viewing Room Rental / Cataloguing / Photography (xx hours)", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "local-row-documentation", group: "LOCAL-ROW", code: "DOCUMENTATION", label: "Documentation & Communication", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "storage-lts-per-cbm", group: "STORAGE", code: "LTS - PER CBM", label: "Storage Fees for xxx CBM (dd/mm - dd/mm/yyyy)", unit: "CBM / month", rate: 175.0, min: 0.0, vat: true },
  { id: "storage-lts-per-sqm", group: "STORAGE", code: "LTS - PER SQM", label: "Storage Fees for xxx SQM (dd/mm - dd/mm/yyyy)", unit: "SQM / month", rate: 350.0, min: 0.0, vat: true },
  { id: "storage-lts-per-item", group: "STORAGE", code: "LTS - PER ITEM", label: "Storage Fees for xxx Artworks (dd/mm - dd/mm/yyyy)", unit: "Artwork / month", rate: 0.0, min: 0.0, vat: true },
  { id: "storage-short-term", group: "STORAGE", code: "SHORT TERM", label: "Intermediate Storage (xxx CBM)", unit: "CBM / Day", rate: 35.0, min: 0.0, vat: true },
  { id: "storage-inv-check-in", group: "STORAGE", code: "INV CHECK IN", label: "Warehouse-Inventory (In)", unit: "Item", rate: 75.0, min: 0.0, vat: true },
  { id: "storage-inv-check-out", group: "STORAGE", code: "INV CHECK OUT", label: "Warehouse-Inventory (Out)", unit: "Item", rate: 75.0, min: 0.0, vat: true },
  { id: "storage-inv-transfer", group: "STORAGE", code: "INV TRANSFER", label: "Warehouse-Inventory (Transfer)", unit: "Item", rate: 75.0, min: 0.0, vat: true },
  { id: "export-dxb-exp-customs-perm", group: "EXPORT-DXB", code: "EXP CUSTOMS (PERM)", label: "UAE Export Customs Formalities (Permanent Export)", unit: "Each", rate: 550.0, min: 375.0, vat: false },
  { id: "export-dxb-exp-customs-temp", group: "EXPORT-DXB", code: "EXP CUSTOMS (TEMP)", label: "UAE Export Customs Formalities (Temporary Export)", unit: "Each", rate: 550.0, min: 375.0, vat: false },
  { id: "export-dxb-re-exp-customs", group: "EXPORT-DXB", code: "RE-EXP CUSTOMS", label: "UAE Re-Export Customs Formalities", unit: "Each", rate: 550.0, min: 0.0, vat: false },
  { id: "export-dxb-export-license", group: "EXPORT-DXB", code: "EXPORT LICENSE", label: "Export License Application & Processing", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-dxb-coo", group: "EXPORT-DXB", code: "COO", label: "Certificate of Origin (Chamber of Commerce)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-dxb-carnet-fees", group: "EXPORT-DXB", code: "CARNET FEES", label: "Carnet ATA Processing Fees", unit: "Each", rate: 175.0, min: 175.0, vat: false },
  { id: "export-dxb-exp-inspection", group: "EXPORT-DXB", code: "EXP INSPECTION", label: "Customs Inspection (as per outlay)", unit: "Each", rate: 170.0, min: 0.0, vat: false },
  { id: "export-row-exp-customs-perm", group: "EXPORT-ROW", code: "EXP CUSTOMS (PERM)", label: "Export Customs Formalities (Permanent Export)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-row-exp-customs-temp", group: "EXPORT-ROW", code: "EXP CUSTOMS (TEMP)", label: "Export Customs Formalities (Temporary Export)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-row-re-exp-customs", group: "EXPORT-ROW", code: "RE-EXP CUSTOMS", label: "Re-Export Customs Formalities", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-row-export-license", group: "EXPORT-ROW", code: "EXPORT LICENSE", label: "Export License Application & Processing", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-row-coo", group: "EXPORT-ROW", code: "COO", label: "Certificate of Origin (Chamber of Commerce)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-row-exp-inspection", group: "EXPORT-ROW", code: "EXP INSPECTION", label: "Customs Inspection (as per outlay)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-dxb-airport-delivery", group: "EXPORT-AIR-DXB", code: "AIRPORT DELIVERY", label: "Delivery to DXB Airport, Handling and Documentation", unit: "Each", rate: 650.0, min: 0.0, vat: false },
  { id: "export-air-dxb-airport-thc", group: "EXPORT-AIR-DXB", code: "AIRPORT THC", label: "Airport Terminal Handling Charges (Export)", unit: "Kg", rate: 15.0, min: 450.0, vat: false },
  { id: "export-air-dxb-sec-screening", group: "EXPORT-AIR-DXB", code: "SEC SCREENING", label: "X-Ray Screening Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-dxb-awb", group: "EXPORT-AIR-DXB", code: "AWB", label: "Air Way Bill Charges", unit: "Each", rate: 100.0, min: 0.0, vat: false },
  { id: "export-air-dxb-airport-supervision-out", group: "EXPORT-AIR-DXB", code: "AIRPORT SUPERVISION (OUT)", label: "Tarmac Supervision on Departure at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-dxb-airport-supervision-trans", group: "EXPORT-AIR-DXB", code: "AIRPORT SUPERVISION (TRANS)", label: "Tarmac Supervision in Transit at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "export-air-dxb-airport-supervision-in", group: "EXPORT-AIR-DXB", code: "AIRPORT SUPERVISION (IN)", label: "Airport Supervision on Arrival", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-airport-delivery", group: "EXPORT-AIR-ROW", code: "AIRPORT DELIVERY", label: "Delivery to xxx Airport, Handling and Documentation", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-airport-thc", group: "EXPORT-AIR-ROW", code: "AIRPORT THC", label: "Airport Terminal Handling Charges (Export)", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-sec-screening", group: "EXPORT-AIR-ROW", code: "SEC SCREENING", label: "X-Ray Screening Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-awb", group: "EXPORT-AIR-ROW", code: "AWB", label: "Air Way Bill Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-airport-supervision-out", group: "EXPORT-AIR-ROW", code: "AIRPORT SUPERVISION (OUT)", label: "Tarmac Supervision on Departure at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-airport-supervision-trans", group: "EXPORT-AIR-ROW", code: "AIRPORT SUPERVISION (TRANS)", label: "Tarmac Supervision in Transit at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-air-row-airport-supervision-in", group: "EXPORT-AIR-ROW", code: "AIRPORT SUPERVISION (IN)", label: "Airport Supervision on Arrival", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-dxb-ctr-loading", group: "EXPORT-SEA-DXB", code: "CTR LOADING", label: "Loading and Stuffing of xx Containers (xxx CBM)", unit: "CBM", rate: 35.0, min: 350.0, vat: false },
  { id: "export-sea-dxb-port-delivery", group: "EXPORT-SEA-DXB", code: "Port Delivery", label: "Delivery to xxx port, Handling and Documentation (xx Containers)", unit: "Each", rate: 1100.0, min: 0.0, vat: false },
  { id: "export-sea-dxb-port-thc", group: "EXPORT-SEA-DXB", code: "PORT THC", label: "Export Terminal Handling Charges at xxxx Port", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-dxb-port-charges", group: "EXPORT-SEA-DXB", code: "PORT CHARGES", label: "Other Port Charges (ISPS, Token, Seal, Harbour Fees, etc)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-dxb-sec-screening", group: "EXPORT-SEA-DXB", code: "SEC SCREENING", label: "Container Inspection and X-Ray Screening Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-dxb-b-l", group: "EXPORT-SEA-DXB", code: "B/L", label: "Bill of Lading Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-row-ctr-loading", group: "EXPORT-SEA-ROW", code: "CTR LOADING", label: "Loading and Stuffing of xx Containers (xxx CBM)", unit: "CBM", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-row-port-delivery", group: "EXPORT-SEA-ROW", code: "Port Delivery", label: "Delivery to xxx port, Handling and Documentation (xx Containers)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-row-port-thc", group: "EXPORT-SEA-ROW", code: "PORT THC", label: "Export Terminal Handling Charges at xxxx Port", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-row-port-charges", group: "EXPORT-SEA-ROW", code: "PORT CHARGES", label: "Other Port Charges (ISPS, Token, Seal, Harbour Fees, etc)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-row-sec-screening", group: "EXPORT-SEA-ROW", code: "SEC SCREENING", label: "Container Inspection and X-Ray Screening Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "export-sea-row-b-l", group: "EXPORT-SEA-ROW", code: "B/L", label: "Bill of Lading Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-inbound-airfreight", group: "FREIGHT-INBOUND", code: "AIRFREIGHT", label: "Airfreight from xxx to xxx Airport, based on xxx Vol.Kg", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-inbound-air-surcharges", group: "FREIGHT-INBOUND", code: "AIR SURCHARGES", label: "Fuel- and Security Surcharges (as per outlay)", unit: "per outlay", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-inbound-sea-freight-lcl", group: "FREIGHT-INBOUND", code: "SEA FREIGHT (LCL)", label: "LCL Sea Freight from xxx up to xxx port based on xxx CBM", unit: "CBM", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-inbound-sea-freight-fcl", group: "FREIGHT-INBOUND", code: "SEA FREIGHT (FCL)", label: "FCL Sea Freight from xxx to free arrival xxx port based on xx container(s)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-inbound-courier", group: "FREIGHT-INBOUND", code: "COURIER", label: "Courier charges from xxx to xxx (door to door)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-outbound-airfreight", group: "FREIGHT-OUTBOUND", code: "AIRFREIGHT", label: "Airfreight from xxx to xxx Airport, based on xxx Vol.Kg", unit: "Kg", rate: 0.0, min: 1000.0, vat: false },
  { id: "freight-outbound-air-surcharges", group: "FREIGHT-OUTBOUND", code: "AIR SURCHARGES", label: "Fuel- and Security Surcharges (as per outlay)", unit: "per outlay", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-outbound-sea-freight-lcl", group: "FREIGHT-OUTBOUND", code: "SEA FREIGHT (LCL)", label: "LCL Sea Freight from xxx up to xxx port based on xxx CBM", unit: "CBM", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-outbound-sea-freight-fcl", group: "FREIGHT-OUTBOUND", code: "SEA FREIGHT (FCL)", label: "FCL Sea Freight from xxx to free arrival xxx port based on xx container(s)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "freight-outbound-courier", group: "FREIGHT-OUTBOUND", code: "COURIER", label: "Courier charges from xxx to xxx (door to door)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "insurance-air-transit-insurance", group: "INSURANCE", code: "AIR TRANSIT  INSURANCE", label: "Transit insurance from xxx to xxx by airfreight (Value: xxxx USD)", unit: "%", rate: 0.0, min: 350.0, vat: false },
  { id: "insurance-sea-transit-insurance", group: "INSURANCE", code: "SEA TRANSIT  INSURANCE", label: "Transit insurance from xxx to xxx by sea freight (Value: xxxx USD)", unit: "%", rate: 0.0, min: 350.0, vat: false },
  { id: "insurance-land-transit-insurance", group: "INSURANCE", code: "LAND TRANSIT  INSURANCE", label: "Transit insurance from xxx to xxx by land transport (Value: xxxx USD)", unit: "%", rate: 0.0, min: 0.0, vat: true },
  { id: "insurance-exhibition-insurance", group: "INSURANCE", code: "EXHIBITION INSURANCE", label: "Exhibition insurance from dd/mm/yy to dd/mm/yy (xx months)", unit: "% per month", rate: 0.0, min: 0.0, vat: true },
  { id: "insurance-storage-insurance", group: "INSURANCE", code: "STORAGE INSURANCE", label: "Storage insurance from dd/mm/yy to dd/mm/yy (xx months)", unit: "% per month", rate: 0.0, min: 0.0, vat: true },
  { id: "import-dxb-imp-customs-perm", group: "IMPORT-DXB", code: "IMP CUSTOMS (PERM)", label: "Import Customs Formalities (Permanent Import)", unit: "Each", rate: 375.0, min: 0.0, vat: false },
  { id: "import-dxb-imp-customs-temp", group: "IMPORT-DXB", code: "IMP CUSTOMS (TEMP)", label: "Import Customs Formalities (Temporary Import)", unit: "Each", rate: 480.0, min: 0.0, vat: false },
  { id: "import-dxb-re-imp-customs", group: "IMPORT-DXB", code: "RE-IMP CUSTOMS", label: "Re-Import Customs Formalities", unit: "Each", rate: 375.0, min: 0.0, vat: false },
  { id: "import-dxb-import-license", group: "IMPORT-DXB", code: "IMPORT LICENSE", label: "Import License Application & Processing", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-dxb-imp-inspection", group: "IMPORT-DXB", code: "IMP INSPECTION", label: "Customs Inspection (as per outlay)", unit: "per outlay", rate: 0.0, min: 0.0, vat: false },
  { id: "import-dxb-carnet-fees", group: "IMPORT-DXB", code: "CARNET FEES", label: "Carnet ATA Processing Fees", unit: "Each", rate: 175.0, min: 175.0, vat: false },
  { id: "import-dxb-deposits", group: "IMPORT-DXB", code: "DEPOSITS", label: "Provision of Customs Deposit (Value: xxx)", unit: "% per month", rate: 0.0, min: 500.0, vat: false },
  { id: "import-dxb-duty", group: "IMPORT-DXB", code: "DUTY", label: "Import Duty (as per outlay) - xx % of the declared Value (xxxx AED)", unit: "%", rate: 0.0, min: 0.0, vat: false },
  { id: "import-dxb-vat", group: "IMPORT-DXB", code: "VAT", label: "Import V.A.T (as per outlay) - xx % of the declared Value (xxxx AED)", unit: "%", rate: 0.0, min: 0.0, vat: false },
  { id: "import-dxb-disbursement", group: "IMPORT-DXB", code: "DISBURSEMENT", label: "Disbursement Fee", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-imp-customs-perm", group: "IMPORT-ROW", code: "IMP CUSTOMS (PERM)", label: "Import Customs Formalities (Permanent Import)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-imp-customs-temp", group: "IMPORT-ROW", code: "IMP CUSTOMS (TEMP)", label: "Import Customs Formalities (Temporary Import)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-re-imp-customs", group: "IMPORT-ROW", code: "RE-IMP CUSTOMS", label: "Re-Import Customs Formalities", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-import-license", group: "IMPORT-ROW", code: "IMPORT LICENSE", label: "Import License Application & Processing", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-imp-inspection", group: "IMPORT-ROW", code: "IMP INSPECTION", label: "Customs Inspection (as per outlay)", unit: "per outlay", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-deposits", group: "IMPORT-ROW", code: "DEPOSITS", label: "Provision of Customs Deposit (Value: xxx)", unit: "% per month", rate: 0.0, min: 500.0, vat: false },
  { id: "import-row-duty", group: "IMPORT-ROW", code: "DUTY", label: "Import Duty (as per outlay) - xx % of the declared Value (xxxx USD)", unit: "%", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-vat", group: "IMPORT-ROW", code: "VAT", label: "Import V.A.T (as per outlay) - xx % of the declared Value (xxxx USD)", unit: "%", rate: 0.0, min: 0.0, vat: false },
  { id: "import-row-disbursement", group: "IMPORT-ROW", code: "DISBURSEMENT", label: "Disbursement Fee", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airport-collection", group: "IMPORT-AIR-DXB", code: "AIRPORT COLLECTION", label: "Collection from xxx Airport and delivery to xxx", unit: "Each", rate: 415.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airport-collection-dxb", group: "IMPORT-AIR-DXB", code: "AIRPORT COLLECTION DXB", label: "DXB Airport Handling and Arrival Charges (up to 500 kgs)", unit: "Kg", rate: 0.5, min: 550.0, vat: false },
  { id: "import-air-dxb-documentation", group: "IMPORT-AIR-DXB", code: "DOCUMENTATION", label: "Import Customs Documentation and Bill of Entry", unit: "Each", rate: 350.0, min: 0.0, vat: false },
  { id: "import-air-dxb-documentation-perm", group: "IMPORT-AIR-DXB", code: "DOCUMENTATION (PERM)", label: "Permanent Customs Documentation and Bill of Entry", unit: "Each", rate: 350.0, min: 0.0, vat: false },
  { id: "import-air-dxb-duty", group: "IMPORT-AIR-DXB", code: "DUTY", label: "Import Customs Duty- 5% of the CIF value (xxx)", unit: "Value", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-dxb-customs", group: "IMPORT-AIR-DXB", code: "CUSTOMS", label: "Customs Inspection", unit: "Each", rate: 200.0, min: 0.0, vat: false },
  { id: "import-air-dxb-carnet-fees", group: "IMPORT-AIR-DXB", code: "CARNET FEES", label: "Carnet ATA Processing Fees", unit: "Each", rate: 175.0, min: 175.0, vat: false },
  { id: "import-air-dxb-transportation", group: "IMPORT-AIR-DXB", code: "TRANSPORTATION", label: "Transportation from DXB airport to our bonded warehouse", unit: "Trip", rate: 415.0, min: 0.0, vat: true },
  { id: "import-air-dxb-crate-disposal", group: "IMPORT-AIR-DXB", code: "CRATE DISPOSAL", label: "Crate Disposal", unit: "Each", rate: 75.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airport-thc", group: "IMPORT-AIR-DXB", code: "AIRPORT THC", label: "Import Terminal Handling Charges at xxx Airport", unit: "Kg", rate: 15.0, min: 450.0, vat: false },
  { id: "import-air-dxb-sec-screening", group: "IMPORT-AIR-DXB", code: "SEC SCREENING", label: "X-Ray Screening Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airline-release", group: "IMPORT-AIR-DXB", code: "AIRLINE RELEASE", label: "Airline Release Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airport-supervision-in", group: "IMPORT-AIR-DXB", code: "AIRPORT SUPERVISION (IN)", label: "Tarmac Supervision on Arrival at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airport-supervision-trans", group: "IMPORT-AIR-DXB", code: "AIRPORT SUPERVISION (TRANS)", label: "Tarmac Supervision in Transit at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-dxb-airline-storage", group: "IMPORT-AIR-DXB", code: "AIRLINE STORAGE", label: "Airline Storage Charges", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-airport-collection", group: "IMPORT-AIR-ROW", code: "AIRPORT COLLECTION", label: "Collection from xxx Airport and delivery to xxx", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-airport-thc", group: "IMPORT-AIR-ROW", code: "AIRPORT THC", label: "Import Terminal Handling Charges at xxx Airport", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-sec-screening", group: "IMPORT-AIR-ROW", code: "SEC SCREENING", label: "X-Ray Screening Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-airline-release", group: "IMPORT-AIR-ROW", code: "AIRLINE RELEASE", label: "Airline Release Charges", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-airport-supervision-in", group: "IMPORT-AIR-ROW", code: "AIRPORT SUPERVISION (IN)", label: "Tarmac Supervision on Arrival at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-airport-supervision-trans", group: "IMPORT-AIR-ROW", code: "AIRPORT SUPERVISION (TRANS)", label: "Tarmac Supervision in Transit at xxx Airport", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-air-row-airline-storage", group: "IMPORT-AIR-ROW", code: "AIRLINE STORAGE", label: "Airline Storage Charges", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-dxb-collection", group: "IMPORT-SEA-DXB", code: "COLLECTION", label: "Collection from xxxx port and transport to xxxx (xx Containers)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-dxb-port-thc", group: "IMPORT-SEA-DXB", code: "PORT THC", label: "Import Terminal Handling Charges at xxxx Port", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-dxb-port-charges", group: "IMPORT-SEA-DXB", code: "PORT CHARGES", label: "Other Port Charges (ISPS, Token, Harbour Fees, etc)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-dxb-sec-screening", group: "IMPORT-SEA-DXB", code: "SEC SCREENING", label: "Container Inspection and X-Ray Screening Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-dxb-d-o", group: "IMPORT-SEA-DXB", code: "D/O", label: "Delivery Order & Port Release Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-row-collection", group: "IMPORT-SEA-ROW", code: "COLLECTION", label: "Collection from xxxx port and transport to xxxx (xx Containers)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-row-port-thc", group: "IMPORT-SEA-ROW", code: "PORT THC", label: "Import Terminal Handling Charges at xxxx Port", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-row-port-charges", group: "IMPORT-SEA-ROW", code: "PORT CHARGES", label: "Other Port Charges (ISPS, Token, Harbour Fees, etc)", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-row-sec-screening", group: "IMPORT-SEA-ROW", code: "SEC SCREENING", label: "Container Inspection and X-Ray Screening Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "import-sea-row-d-o", group: "IMPORT-SEA-ROW", code: "D/O", label: "Delivery Order & Port Release Fees", unit: "Each", rate: 0.0, min: 0.0, vat: false },
  { id: "fair-art-dubai-ad-inbound-air", group: "FAIR - ART DUBAI", code: "AD-INBOUND-AIR", label: "Fixed rate inclusive of: DXB Airport & Terminal Handling Charges; Collection, loading and transport to our warehouse; Warehouse handling and intermediate storage; Import Customs Clearance & Documentation; Delivery to booth at Art Dubai (no unpacking); Collection of empty crates, storage and return", unit: "Kg", rate: 1.25, min: 550.0, vat: false },
  { id: "fair-art-dubai-customs-inspection", group: "FAIR - ART DUBAI", code: "CUSTOMS  INSPECTION", label: "Customs Inspection Charges", unit: "Each", rate: 45.0, min: 45.0, vat: false },
  { id: "fair-art-dubai-import-export", group: "FAIR - ART DUBAI", code: "IMPORT/EXPORT", label: "Temporary Import/ Export Formalities", unit: "Each", rate: 115.0, min: 115.0, vat: false },
  { id: "fair-art-dubai-import-export-2", group: "FAIR - ART DUBAI", code: "IMPORT/EXPORT", label: "Permanent Import/ Export Formalities", unit: "Each", rate: 95.0, min: 95.0, vat: false },
  { id: "fair-art-dubai-customs-bond", group: "FAIR - ART DUBAI", code: "CUSTOMS BOND", label: "Customs Bond Waiver", unit: "Each", rate: 250.0, min: 250.0, vat: false },
  { id: "fair-art-dubai-labour", group: "FAIR - ART DUBAI", code: "LABOUR", label: "Labour (USD 35 / per hour) - min. 2 hours", unit: "Hour", rate: 35.0, min: 70.0, vat: true },
  { id: "fair-art-dubai-loc-art-handler", group: "FAIR - ART DUBAI", code: "LOC ART HANDLER", label: "Local Art Handler (USD 65 / per hour) - min. 2 hours", unit: "Hour", rate: 65.0, min: 130.0, vat: true },
  { id: "fair-art-dubai-int-art-handler", group: "FAIR - ART DUBAI", code: "INT ART HANDLER", label: "International Art Handler (USD 165 / per hour) - min. 2 hours", unit: "Hour", rate: 160.0, min: 320.0, vat: true },
  { id: "fair-art-dubai-gantry-crane", group: "FAIR - ART DUBAI", code: "GANTRY CRANE", label: "Gantry Crane with Operator", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "fair-art-dubai-supervision", group: "FAIR - ART DUBAI", code: "SUPERVISION", label: "Tarmac Supervision", unit: "Each", rate: 700.0, min: 0.0, vat: true },
  { id: "fair-art-dubai-packing-material", group: "FAIR - ART DUBAI", code: "PACKING MATERIAL", label: "Packing Materials", unit: "Each", rate: 0.0, min: 0.0, vat: true },
  { id: "fair-art-dubai-w-h-handling-in", group: "FAIR - ART DUBAI", code: "W/H HANDLING (IN)", label: "Warehouse Handling (IN)", unit: "CBM", rate: 10.0, min: 20.0, vat: true },
  { id: "fair-art-dubai-w-h-handling-out", group: "FAIR - ART DUBAI", code: "W/H HANDLING (OUT)", label: "Warehouse Handling (OUT)", unit: "CBM", rate: 10.0, min: 20.0, vat: true },
  { id: "fair-art-dubai-condition-reporting", group: "FAIR - ART DUBAI", code: "CONDITION REPORTING", label: "Condition Reporting (xx Artworks)", unit: "Artwork", rate: 20.0, min: 0.0, vat: true },
  { id: "fair-art-dubai-viewing-room", group: "FAIR - ART DUBAI", code: "VIEWING ROOM", label: "Viewing Room Rental / Cataloguing / Photography (xx hours)", unit: "Hour", rate: 50.0, min: 200.0, vat: true },
  { id: "fair-art-dubai-documentation", group: "FAIR - ART DUBAI", code: "DOCUMENTATION", label: "Documentation & Communication", unit: "Each", rate: 50.0, min: 50.0, vat: true },
  { id: "fair-art-dubai-transportation", group: "FAIR - ART DUBAI", code: "TRANSPORTATION", label: "Art Transport withing Dubai City Limits", unit: "Trips", rate: 220.0, min: 220.0, vat: true },
  { id: "fair-art-dubai-transportation-2", group: "FAIR - ART DUBAI", code: "TRANSPORTATION", label: "Art Transport to other Emirates", unit: "Trips", rate: 340.0, min: 340.0, vat: true },
  { id: "fair-art-dubai-release-of-items-form-storage", group: "FAIR - ART DUBAI", code: "RELEASE OF ITEMS FORM STORAGE", label: "Release of single items from storage", unit: "Each", rate: 25.0, min: 25.0, vat: true },
  { id: "fair-art-dubai-release-external-shipper", group: "FAIR - ART DUBAI", code: "RELEASE - EXTERNAL SHIPPER", label: "Release of shipments to external shippers", unit: "Each", rate: 150.0, min: 150.0, vat: true },
  { id: "fair-art-dubai-ad-outbound-air", group: "FAIR - ART DUBAI", code: "AD-OUTBOUND-AIR", label: "Fixed rate inclusive of: Collection from booth, loading and transport to our warehouse; Warehouse handling and intermediate storage; Export Customs Clearance & Documentation; Delivery to DXB Airport, Terminal Handling & Documentation", unit: "Kg", rate: 1.25, min: 550.0, vat: false },
  { id: "fair-art-dubai-ad-inbound-sea-fcl-20-ctr", group: "FAIR - ART DUBAI", code: "AD INBOUND- SEA (FCL) 20' Ctr", label: "Fixed rate inclusive of: Terminal Handling Charges, D/O Fee, ISPS; Collection of container and transpot to; Offloading, handling and intermediate storage; Import Customs Clearance & Documentation; Delivery to booth at Art Dubai (no unpacking); Collection of empty crates, storage and return", unit: "Each", rate: 1875.0, min: 1875.0, vat: false },
  { id: "fair-art-dubai-ad-inbound-sea-fcl-40-ctr", group: "FAIR - ART DUBAI", code: "AD INBOUND- SEA (FCL) 40' Ctr", label: "Fixed rate inclusive of: Terminal Handling Charges, D/O Fee, ISPS; Collection of container and transpot to; Offloading, handling and intermediate storage; Import Customs Clearance & Documentation; Delivery to booth at Art Dubai (no unpacking); Collection of empty crates, storage and return", unit: "Each", rate: 2695.0, min: 2695.0, vat: false },
  { id: "fair-art-dubai-ad-outbound-sea-fcl-20-ctr", group: "FAIR - ART DUBAI", code: "AD OUTBOUND- SEA (FCL) 20' Ctr", label: "Fixed rate inclusive of: Terminal Handling Charges, D/O Fee, ISPS; Collection of container and transpot to W/H; Loading, handlig and intermediate storage; Export Customs Clearence & Documentation; Haulage to DXB Seaport", unit: "Each", rate: 1875.0, min: 1875.0, vat: false },
  { id: "fair-art-dubai-ad-outbound-sea-fcl-40-ctr", group: "FAIR - ART DUBAI", code: "AD OUTBOUND- SEA (FCL) 40' Ctr", label: "Fixed rate inclusive of: Terminal Handling Charges, D/O Fee, ISPS; Collection of container and transpot to W/H; Loading, handlig and intermediate storage; Export Customs Clearence & Documentation; Haulage to DXB Seaport", unit: "Each", rate: 2695.0, min: 2695.0, vat: false },
  { id: "fair-art-dubai-ad-inbound-sea-lcl", group: "FAIR - ART DUBAI", code: "AD INBOUND- SEA (LCL)", label: "Fixed rate inclusive of: D/O Fee, ISPS; Collection of container and transport to; Offloading, handling and intermediate storage; Import Customs Clearence & Documentation; Delivery to booth at Art Dubai (no unpacking); Collection of empty crates, storage and return", unit: "CBM", rate: 95.0, min: 550.0, vat: false },
  { id: "fair-art-dubai-ad-outbound-sea-lcl", group: "FAIR - ART DUBAI", code: "AD OUTBOUND- SEA (LCL)", label: "Fixed rate inclusive of: Terminal Handling Charges, D/O Fee/ ISPS; Collection and transport to our warehouse; Loading, handling and intermediate storage; Export Customs Clearence & Documentation; Delivery to DXB Seaport", unit: "CBM", rate: 115.0, min: 550.0, vat: false },
  { id: "fair-row-fair-row-inbound-air", group: "FAIR - ROW", code: "FAIR-ROW-INBOUND-AIR", label: "Fixed Rate Inclusive of: Airport & Terminal Handling Charges; Collection, Loading and transport to local warehouse; Warehouse handling and intermediate storage; Import Customs Clearance & Documentation; Delivery to Booth (no unpacking); Collection of empty crates, storage and return", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "fair-row-fair-row-outbound-air", group: "FAIR - ROW", code: "FAIR -ROW- OUTBOUND-AIR", label: "Fixed Rate Inclusive of: Collection from Booth, loading and transport to our warehouse; Warehouse handling and intermediate storage; Export Customs Clearance & Documentation; Delivery to Airport, Terminal Handling & Documentation", unit: "Kg", rate: 0.0, min: 0.0, vat: false },
  { id: "fair-row-loc-art-handler", group: "FAIR - ROW", code: "LOC ART HANDLER", label: "Local Art Handler - min. 4 hours / 2 handlers", unit: "Hour", rate: 0.0, min: 0.0, vat: false },
  { id: "discount-discount", group: "DISCOUNT", code: "DISCOUNT", label: "Discount", unit: "", rate: 0.0, min: 0.0, vat: false },
  { id: "third-party-third-party", group: "THIRD PARTY", code: "THIRD PARTY", label: "THIRD PARTY PRICING", unit: "", rate: 0.0, min: 0.0, vat: false },
];
export const SERVICE_BY = Object.fromEntries(SERVICES.map(x => [x.id, x]));

/* ============ BILLABLE CATALOG (imported from master price book) ============ */
export const GL_FAMILIES = [["DISCOUNT","Discount"], ["EXPORT-AIR-DXB","Export air — Dubai"], ["EXPORT-AIR-ROW","Export air — overseas"], ["EXPORT-ROW","Export — overseas"], ["EXPORT-SEA-DXB","Export sea — Dubai"], ["FREIGHT-INBOUND","Freight — inbound"], ["FREIGHT-OUTBOUND","Freight — outbound"], ["IMPORT-AIR-DXB","Import air — Dubai"], ["IMPORT-AIR-ROW","Import air — overseas"], ["IMPORT-DXB","Import — Dubai"], ["IMPORT-ROW","Import — overseas"], ["IMPORT-SEA-DXB","Import sea — Dubai"], ["IMPORT-SEA-ROW","Import sea — overseas"], ["INSURANCE","Insurance"], ["LOCAL-DXB","Local — Dubai"], ["LOCAL-ROW","Local — overseas"], ["STORAGE","Storage"], ["THIRD PARTY","Third party"]];
export const GL_LABEL = Object.fromEntries(GL_FAMILIES);
export const SERVICE_CATALOG = [
  {id:"LOCAL-DXB-COLLECTION",fam:"LOCAL-DXB",c2:"COLLECTION",desc:"Collection from one address in Dubai and transport to our warehouse",rate:850,drv:"Per truck",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-DELIVERY",fam:"LOCAL-DXB",c2:"DELIVERY",desc:"Delivery to one address in Dubai (City Limits), inlc. unloading",rate:850,drv:"Per truck",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-COLLECTION-OTHER-EMIRATES",fam:"LOCAL-DXB",c2:"COLLECTION OTHER EMIRATES",desc:"Collection from another emirate and transport to our warehouse",rate:1250,drv:"Per truck",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-DELIVERY-OTHER-EMIRATES",fam:"LOCAL-DXB",c2:"DELIVERY OTHER EMIRATES",desc:"Delivery to one address in another emirate inlc. unloading",rate:1250,drv:"Per truck",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-ADD-COLLECTION-ADDRESS",fam:"LOCAL-DXB",c2:"ADD. COLLECTION ADDRESS",desc:"Collection from one additional address in Dubai (City Limits)",rate:200,drv:"Per trip",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-ADD-DELIVERY-ADDRESS",fam:"LOCAL-DXB",c2:"ADD. DELIVERY ADDRESS",desc:"Delivery to one additional address in Dubai (City Limits)",rate:200,drv:"Per trip",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-LOCAL-TRANSPORT-D2D",fam:"LOCAL-DXB",c2:"LOCAL TRANSPORT D2D",desc:"Transport with dedicated fine art truck, incl.. loading and unloading",rate:1000,drv:"Per truck",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-TRANSPORT-EMIRATES-D2D",fam:"LOCAL-DXB",c2:"TRANSPORT EMIRATES D2D",desc:"Transport with dedicated fine art truck between emirates, incl.. loading and unloading",rate:1500,drv:"Per truck",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-LOADING",fam:"LOCAL-DXB",c2:"LOADING",desc:"Loading and Stuffing (xx Men,  xx Hours)",rate:85,drv:"Man-hours",unit:"Hour",min:0,vat:true},
  {id:"LOCAL-DXB-OFFLOADING",fam:"LOCAL-DXB",c2:"OFFLOADING",desc:"Offloading (xx Men,  xx Hours)",rate:85,drv:"Man-hours",unit:"Hour",min:0,vat:true},
  {id:"LOCAL-DXB-FORKLIFT",fam:"LOCAL-DXB",c2:"FORKLIFT",desc:"Forklift Charges",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-CRANE",fam:"LOCAL-DXB",c2:"CRANE",desc:"Crane Charges",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-PACKING",fam:"LOCAL-DXB",c2:"PACKING",desc:"Soft-Packing of xxx items (xx Men x xx Hours)",rate:85,drv:"Man-hours",unit:"Each",min:170,vat:true},
  {id:"LOCAL-DXB-PACKING-MATERIAL",fam:"LOCAL-DXB",c2:"PACKING MATERIAL",desc:"Packing Materials",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-CRATING",fam:"LOCAL-DXB",c2:"CRATING",desc:"Construction of xx crate(s) (dims: yy x yy x yy cm)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-UNPACKING",fam:"LOCAL-DXB",c2:"UNPACKING",desc:"Unpacking and removal of debris (xx men x xx hours)",rate:85,drv:"Man-hours",unit:"Hour",min:170,vat:true},
  {id:"LOCAL-DXB-W-H-HANDLING-IN",fam:"LOCAL-DXB",c2:"W/H HANDLING (IN)",desc:"Warehouse Handling (IN)",rate:55,drv:"Volume (CBM)",unit:"CBM",min:70,vat:true},
  {id:"LOCAL-DXB-W-H-HANDLING-OUT",fam:"LOCAL-DXB",c2:"W/H HANDLING (OUT)",desc:"Warehouse Handling (OUT)",rate:55,drv:"Volume (CBM)",unit:"CBM",min:70,vat:true},
  {id:"LOCAL-DXB-W-H-HANDLING-IN-OUT",fam:"LOCAL-DXB",c2:"W/H HANDLING (IN/OUT)",desc:"Warehouse Handling (In/OUT)",rate:110,drv:"Volume (CBM)",unit:"CBM",min:70,vat:true},
  {id:"LOCAL-DXB-GATE-PASS-IN",fam:"LOCAL-DXB",c2:"GATE PASS (IN)",desc:"Entry Gate Pass Fee",rate:175,drv:"Per trip",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-GATE-PASS-OUT",fam:"LOCAL-DXB",c2:"GATE PASS (OUT)",desc:"Exit Gate Pass Fee",rate:175,drv:"Per trip",unit:"Each",min:0,vat:true},
  {id:"LOCAL-DXB-INSTALLATION",fam:"LOCAL-DXB",c2:"INSTALLATION",desc:"Installation Services xx Art Handlers x xx Hours) - xx hrs",rate:85,drv:"Man-hours",unit:"Hour",min:170,vat:true},
  {id:"LOCAL-DXB-OVERTIME-50",fam:"LOCAL-DXB",c2:"OVERTIME 50%",desc:"50% Overtime Surcharge (xx Art Handlers, from xxxx to xxxx) xx hrs",rate:112.5,drv:"Man-hours",unit:"Hour",min:null,vat:true},
  {id:"LOCAL-DXB-OVERTIME-100",fam:"LOCAL-DXB",c2:"OVERTIME 100%",desc:"100% Overtime Surcharge (xx Art Handlers, from xxxx to xxxx) xx hrs",rate:150,drv:"Man-hours",unit:"Hour",min:null,vat:true},
  {id:"LOCAL-DXB-CRATE-DISPOSAL",fam:"LOCAL-DXB",c2:"CRATE DISPOSAL",desc:"Crate Disposal",rate:200,drv:"Fixed / each",unit:"Crate",min:null,vat:false},
  {id:"LOCAL-DXB-CONDITION-REPORTING",fam:"LOCAL-DXB",c2:"CONDITION REPORTING",desc:"Condition Reporting (xx Artworks)",rate:75,drv:"Per artwork",unit:"Artwork",min:null,vat:true},
  {id:"LOCAL-DXB-VIEWING-ROOM",fam:"LOCAL-DXB",c2:"VIEWING ROOM",desc:"Viewing Room Rental / Cataloguing / Photography (xx hours)",rate:350,drv:"Man-hours",unit:"Hour",min:700,vat:true},
  {id:"LOCAL-DXB-DOCUMENTATION",fam:"LOCAL-DXB",c2:"DOCUMENTATION",desc:"Documentation & Communication",rate:250,drv:"Fixed / each",unit:"Each",min:null,vat:true},
  {id:"LOCAL-ROW-COLLECTION",fam:"LOCAL-ROW",c2:"COLLECTION",desc:"Collection from one address in xxx and transport to Warehouse",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-DELIVERY",fam:"LOCAL-ROW",c2:"DELIVERY",desc:"Delivery to one address in xxx (City Limits), inlc. unloading",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-ADD-COLLECTION-ADDRESS",fam:"LOCAL-ROW",c2:"ADD. COLLECTION ADDRESS",desc:"Collection from one additional address in xxx (City Limits)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-ADD-DELIVERY-ADDRESS",fam:"LOCAL-ROW",c2:"ADD. DELIVERY ADDRESS",desc:"Delivery to one additional address in xxxx (City Limits)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-LOCAL-TRANSPORT-D2D",fam:"LOCAL-ROW",c2:"LOCAL TRANSPORT D2D",desc:"Transport with dedicated fine art truck, incl.. loading and unloading",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-LOADING",fam:"LOCAL-ROW",c2:"LOADING",desc:"Loading and Stuffing (xx Men,  xx Hours)",rate:0,drv:"Man-hours",unit:"Hour",min:0,vat:false},
  {id:"LOCAL-ROW-OFFLOADING",fam:"LOCAL-ROW",c2:"OFFLOADING",desc:"Offloading (xx Men,  xx Hours)",rate:0,drv:"Man-hours",unit:"Hour",min:0,vat:false},
  {id:"LOCAL-ROW-FORKLIFT",fam:"LOCAL-ROW",c2:"FORKLIFT",desc:"Forklift Charges",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-CRANE",fam:"LOCAL-ROW",c2:"CRANE",desc:"Crane Charges",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-PACKING",fam:"LOCAL-ROW",c2:"PACKING",desc:"Soft-Packing of xxx items (xx Men x xx Hours)",rate:0,drv:"Man-hours",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-PACKING-MATERIAL",fam:"LOCAL-ROW",c2:"PACKING MATERIAL",desc:"Packing Materials",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-CRATING",fam:"LOCAL-ROW",c2:"CRATING",desc:"Construction of xx crate(s) (dims: cc x cc x cc cm)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"LOCAL-ROW-UNPACKING",fam:"LOCAL-ROW",c2:"UNPACKING",desc:"Unpacking and removal of debris (xx men x xx hours)",rate:0,drv:"Man-hours",unit:"Hour",min:0,vat:false},
  {id:"LOCAL-ROW-W-H-HANDLING-IN",fam:"LOCAL-ROW",c2:"W/H HANDLING (IN)",desc:"Warehouse Handling (IN)",rate:0,drv:"Volume (CBM)",unit:"CBM",min:0,vat:false},
  {id:"LOCAL-ROW-W-H-HANDLING-OUT",fam:"LOCAL-ROW",c2:"W/H HANDLING (OUT)",desc:"Warehouse Handling (OUT)",rate:0,drv:"Volume (CBM)",unit:"CBM",min:0,vat:false},
  {id:"LOCAL-ROW-W-H-HANDLING-IN-OUT",fam:"LOCAL-ROW",c2:"W/H HANDLING (IN/OUT)",desc:"Warehouse Handling (In/OUT)",rate:0,drv:"Volume (CBM)",unit:"CBM",min:0,vat:false},
  {id:"LOCAL-ROW-INSTALLATION",fam:"LOCAL-ROW",c2:"INSTALLATION",desc:"Installation Services xx Art Handlers x xx Hours) - xx hrs",rate:0,drv:"Man-hours",unit:"Hour",min:0,vat:false},
  {id:"LOCAL-ROW-OVERTIME",fam:"LOCAL-ROW",c2:"OVERTIME",desc:"xx % Overtime Surcharge (xx Art Handlers, from xxxx to xxxx) xx hrs",rate:0,drv:"Man-hours",unit:"Hour",min:0,vat:false},
  {id:"LOCAL-ROW-CONDITION-REPORTING",fam:"LOCAL-ROW",c2:"CONDITION REPORTING",desc:"Condition Reporting (xx Artworks)",rate:0,drv:"Per artwork",unit:"Artwork",min:0,vat:false},
  {id:"LOCAL-ROW-CRATE-DISPOSAL",fam:"LOCAL-ROW",c2:"CRATE DISPOSAL",desc:"Crate Disposal",rate:0,drv:"Fixed / each",unit:"Crate",min:0,vat:false},
  {id:"LOCAL-ROW-VIEWING-ROOM",fam:"LOCAL-ROW",c2:"VIEWING ROOM",desc:"Viewing Room Rental / Cataloguing / Photography (xx hours)",rate:0,drv:"Man-hours",unit:"Hour",min:0,vat:false},
  {id:"LOCAL-ROW-DOCUMENTATION",fam:"LOCAL-ROW",c2:"DOCUMENTATION",desc:"Documentation & Communication",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"STORAGE-LTS-PER-CBM",fam:"STORAGE",c2:"LTS - PER CBM",desc:"Storage Fees for xxx CBM (dd/mm - dd/mm/yyyy)",rate:175,drv:"Volume (CBM)",unit:"CBM / month",min:0,vat:true},
  {id:"STORAGE-LTS-PER-SQM",fam:"STORAGE",c2:"LTS - PER SQM",desc:"Storage Fees for xxx SQM (dd/mm - dd/mm/yyyy)",rate:350,drv:"Volume (CBM)",unit:"SQM / month",min:0,vat:true},
  {id:"STORAGE-LTS-PER-ITEM",fam:"STORAGE",c2:"LTS - PER ITEM",desc:"Storage Fees for xxx Artworks  (dd/mm - dd/mm/yyyy)",rate:0,drv:"Per artwork",unit:"Artwork / month",min:0,vat:true},
  {id:"STORAGE-SHORT-TERM",fam:"STORAGE",c2:"SHORT TERM",desc:"Intermediate Storage (xxx CBM)",rate:35,drv:"Volume (CBM)",unit:"CBM / Day",min:0,vat:true},
  {id:"STORAGE-INV-CHECK-IN",fam:"STORAGE",c2:"INV CHECK IN",desc:"Warehouse-Inventory (In)",rate:75,drv:"Per artwork",unit:"Item",min:0,vat:true},
  {id:"STORAGE-INV-CHECK-OUT",fam:"STORAGE",c2:"INV CHECK OUT",desc:"Warehouse-Inventory (Out)",rate:75,drv:"Per artwork",unit:"Item",min:0,vat:true},
  {id:"STORAGE-INV-TRANSFER",fam:"STORAGE",c2:"INV TRANSFER",desc:"Warehouse-Inventory (Transfer)",rate:75,drv:"Per artwork",unit:"Item",min:0,vat:true},
  {id:"EXPORT-ROW-EXP-CUSTOMS-PERM",fam:"EXPORT-ROW",c2:"EXP CUSTOMS (PERM)",desc:"Export Customs Formalities (Permanent Export)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"EXPORT-ROW-EXP-CUSTOMS-TEMP",fam:"EXPORT-ROW",c2:"EXP CUSTOMS (TEMP)",desc:"Export Customs Formalities (Temporary Export)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"EXPORT-AIR-DXB-AIRPORT-DELIVERY",fam:"EXPORT-AIR-DXB",c2:"AIRPORT DELIVERY",desc:"Delivery to DXB Airport, Handling and Documentation",rate:650,drv:"Per trip",unit:"Each",min:0,vat:false},
  {id:"EXPORT-AIR-ROW-AIRPORT-DELIVERY",fam:"EXPORT-AIR-ROW",c2:"AIRPORT DELIVERY",desc:"Delivery to xxx Airport, Handling and Documentation",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"EXPORT-SEA-DXB-CTR-LOADING",fam:"EXPORT-SEA-DXB",c2:"CTR LOADING",desc:"Loading and Stuffing of xx Containers (xxx CBM)",rate:35,drv:"Volume (CBM)",unit:"CBM",min:350,vat:false},
  {id:"EXPORT-SEA-DXB-PORT-DELIVERY",fam:"EXPORT-SEA-DXB",c2:"Port Delivery",desc:"Delivery to xxx port, Handling and Documentation (xx Containers)",rate:1100,drv:"Per container",unit:"Each",min:0,vat:false},
  {id:"EXPORT-SEA-DXB-PORT-THC",fam:"EXPORT-SEA-DXB",c2:"PORT THC",desc:"Export Terminal Handling Charges at xxxx Port",rate:0,drv:"Per container",unit:"Each",min:0,vat:false},
  {id:"EXPORT-SEA-DXB-PORT-CHARGES",fam:"EXPORT-SEA-DXB",c2:"PORT CHARGES",desc:"Other Port Charges (ISPS, Token, Seal, Harbour Fees, etc)",rate:0,drv:"Per container",unit:"Each",min:0,vat:false},
  {id:"EXPORT-SEA-DXB-SEC-SCREENING",fam:"EXPORT-SEA-DXB",c2:"SEC SCREENING",desc:"Container Inspection and X-Ray Screening Fees",rate:0,drv:"Per container",unit:"Each",min:0,vat:false},
  {id:"EXPORT-SEA-DXB-B-L",fam:"EXPORT-SEA-DXB",c2:"B/L",desc:"Bill of Lading Fees",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"FREIGHT-INBOUND-AIRFREIGHT",fam:"FREIGHT-INBOUND",c2:"AIRFREIGHT",desc:"Airfreight from xxx to xxx Airport, based on xxx Vol.Kg",rate:0,drv:"Chargeable weight",unit:"Kg",min:0,vat:false},
  {id:"FREIGHT-OUTBOUND-AIRFREIGHT",fam:"FREIGHT-OUTBOUND",c2:"AIRFREIGHT",desc:"Airfreight from xxx to xxx Airport, based on xxx Vol.Kg",rate:0,drv:"Chargeable weight",unit:"Kg",min:1000,vat:false},
  {id:"FREIGHT-OUTBOUND-SEA-FREIGHT-LCL",fam:"FREIGHT-OUTBOUND",c2:"SEA FREIGHT (LCL)",desc:"LCL Sea Freight from xxx up to  xxx port based on xxx CBM",rate:0,drv:"Volume (CBM)",unit:"CBM",min:0,vat:false},
  {id:"FREIGHT-OUTBOUND-SEA-FREIGHT-FCL",fam:"FREIGHT-OUTBOUND",c2:"SEA FREIGHT (FCL)",desc:"FCL Sea Freight from xxx to free arrival xxx port based on xx container(s)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"INSURANCE-AIR-TRANSIT-INSURANCE",fam:"INSURANCE",c2:"AIR TRANSIT  INSURANCE",desc:"Transit insurance from xxx to xxx by airfreight  (Value: xxxx USD)",rate:0,drv:"% of value",unit:"%",min:350,vat:false},
  {id:"INSURANCE-SEA-TRANSIT-INSURANCE",fam:"INSURANCE",c2:"SEA TRANSIT  INSURANCE",desc:"Transit insurance from xxx to xxx by sea freight  (Value: xxxx USD)",rate:0,drv:"% of value",unit:"%",min:350,vat:false},
  {id:"INSURANCE-LAND-TRANSIT-INSURANCE",fam:"INSURANCE",c2:"LAND TRANSIT  INSURANCE",desc:"Transit insurance from xxx to xxx by land transport  (Value: xxxx USD)",rate:0,drv:"% of value",unit:"%",min:0,vat:true},
  {id:"INSURANCE-EXHIBITION-INSURANCE",fam:"INSURANCE",c2:"EXHIBITION INSURANCE",desc:"Exhibition insurance from dd/mm/yy to dd/mm/yy (xx months)",rate:0,drv:"% of value",unit:"% per month",min:0,vat:true},
  {id:"INSURANCE-STORAGE-INSURANCE",fam:"INSURANCE",c2:"STORAGE INSURANCE",desc:"Storage insurance from dd/mm/yy to dd/mm/yy (xx months)",rate:0,drv:"% of value",unit:"% per month",min:0,vat:true},
  {id:"IMPORT-DXB-IMP-CUSTOMS-PERM",fam:"IMPORT-DXB",c2:"IMP CUSTOMS (PERM)",desc:"Import Customs Formalities (Permanent Import)",rate:375,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-DXB-IMP-CUSTOMS-TEMP",fam:"IMPORT-DXB",c2:"IMP CUSTOMS (TEMP)",desc:"Import Customs Formalities (Temporary Import)",rate:480,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-DXB-IMP-INSPECTION",fam:"IMPORT-DXB",c2:"IMP INSPECTION",desc:"Customs Inspection (as per outlay)",rate:0,drv:"Fixed / each",unit:"per outlay",min:0,vat:false},
  {id:"IMPORT-ROW-IMP-CUSTOMS-PERM",fam:"IMPORT-ROW",c2:"IMP CUSTOMS (PERM)",desc:"Import Customs Formalities (Permanent Import)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-ROW-IMP-CUSTOMS-TEMP",fam:"IMPORT-ROW",c2:"IMP CUSTOMS (TEMP)",desc:"Import Customs Formalities (Temporary Import)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-AIR-DXB-AIRPORT-COLLECTION-DXB",fam:"IMPORT-AIR-DXB",c2:"AIRPORT COLLECTION DXB",desc:"DXB Airport Handling and Arrival Charges (up to 500 kgs)",rate:0.5,drv:"Fixed / each",unit:"Kg",min:550,vat:false},
  {id:"IMPORT-AIR-DXB-DOCUMENTATION",fam:"IMPORT-AIR-DXB",c2:"DOCUMENTATION",desc:"Import Customs Documentation and Bill of Entry",rate:350,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-AIR-DXB-CUSTOMS",fam:"IMPORT-AIR-DXB",c2:"CUSTOMS",desc:"Customs Inspection",rate:200,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-AIR-DXB-TRANSPORTATION",fam:"IMPORT-AIR-DXB",c2:"TRANSPORTATION",desc:"Transportation from DXB airport to our bonded warehouse",rate:415,drv:"Fixed / each",unit:"Trip",min:0,vat:true},
  {id:"IMPORT-AIR-ROW-AIRPORT-COLLECTION",fam:"IMPORT-AIR-ROW",c2:"AIRPORT COLLECTION",desc:"Collection from  xxx Airport and delivery to xxx",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-AIR-ROW-AIRPORT-THC",fam:"IMPORT-AIR-ROW",c2:"AIRPORT THC",desc:"Import Terminal Handling Charges at xxx Airport",rate:0,drv:"Chargeable weight",unit:"Kg",min:0,vat:false},
  {id:"IMPORT-SEA-DXB-COLLECTION",fam:"IMPORT-SEA-DXB",c2:"COLLECTION",desc:"Collection from xxxx port and transport to xxxx (xx Containers)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-DXB-PORT-THC",fam:"IMPORT-SEA-DXB",c2:"PORT THC",desc:"Import Terminal Handling Charges at xxxx Port",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-DXB-PORT-CHARGES",fam:"IMPORT-SEA-DXB",c2:"PORT CHARGES",desc:"Other Port Charges (ISPS, Token, Harbour Fees, etc)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-ROW-COLLECTION",fam:"IMPORT-SEA-ROW",c2:"COLLECTION",desc:"Collection from xxxx port and transport to xxxx (xx Containers)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-ROW-PORT-THC",fam:"IMPORT-SEA-ROW",c2:"PORT THC",desc:"Import Terminal Handling Charges at xxxx Port",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-ROW-PORT-CHARGES",fam:"IMPORT-SEA-ROW",c2:"PORT CHARGES",desc:"Other Port Charges (ISPS, Token, Harbour Fees, etc)",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-ROW-SEC-SCREENING",fam:"IMPORT-SEA-ROW",c2:"SEC SCREENING",desc:"Container Inspection and X-Ray Screening Fees",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"IMPORT-SEA-ROW-D-O",fam:"IMPORT-SEA-ROW",c2:"D/O",desc:"Delivery Order & Port Release Fees",rate:0,drv:"Fixed / each",unit:"Each",min:0,vat:false},
  {id:"DISCOUNT-DISCOUNT",fam:"DISCOUNT",c2:"DISCOUNT",desc:"Discount",rate:0,drv:"Fixed / each",unit:"",min:0,vat:false},
  {id:"THIRD-PARTY-THIRD-PARTY",fam:"THIRD PARTY",c2:"THIRD PARTY",desc:"THIRD PARTY PRICING",rate:0,drv:"Fixed / each",unit:"",min:0,vat:false}
];
export const SERVICE_CAT_BY = Object.fromEntries(SERVICE_CATALOG.map(s => [s.id, s]));
export const JOB_CONFIGS = [
  {label:"AIR - IMPORT",mode:"Air",movement:"Import",seaLoad:"",direction:"",lines:[["LOCAL-ROW-COLLECTION","EXPORT",1],["LOCAL-ROW-PACKING-MATERIAL","EXPORT",2],["LOCAL-ROW-CRATING","EXPORT",3],["LOCAL-ROW-W-H-HANDLING-IN-OUT","EXPORT",4],["LOCAL-ROW-DOCUMENTATION","EXPORT",5],["EXPORT-ROW-EXP-CUSTOMS-PERM","EXPORT",6],["EXPORT-ROW-EXP-CUSTOMS-TEMP","EXPORT",7],["EXPORT-AIR-ROW-AIRPORT-DELIVERY","EXPORT",8],["FREIGHT-INBOUND-AIRFREIGHT","EXPORT",9]]},
  {label:"AIR - DTP (INBOUND)",mode:"Air",movement:"Door-to-port",seaLoad:"",direction:"Inbound",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",4],["LOCAL-DXB-DOCUMENTATION","EXPORT",5],["EXPORT-AIR-DXB-AIRPORT-DELIVERY","EXPORT",6],["FREIGHT-OUTBOUND-AIRFREIGHT","EXPORT",7]]},
  {label:"AIR - DTP (OUTBOUND)",mode:"Air",movement:"Door-to-port",seaLoad:"",direction:"Outbound",lines:[["LOCAL-ROW-COLLECTION","EXPORT",1],["LOCAL-ROW-PACKING-MATERIAL","EXPORT",2],["LOCAL-ROW-CRATING","EXPORT",3],["LOCAL-ROW-W-H-HANDLING-IN-OUT","EXPORT",4],["LOCAL-ROW-DOCUMENTATION","EXPORT",5],["EXPORT-ROW-EXP-CUSTOMS-PERM","EXPORT",6],["EXPORT-ROW-EXP-CUSTOMS-TEMP","EXPORT",7],["EXPORT-AIR-ROW-AIRPORT-DELIVERY","EXPORT",8],["FREIGHT-INBOUND-AIRFREIGHT","EXPORT",9],["IMPORT-AIR-DXB-AIRPORT-COLLECTION-DXB","IMPORT",10],["IMPORT-AIR-DXB-DOCUMENTATION","IMPORT",11],["IMPORT-AIR-DXB-CUSTOMS","IMPORT",12],["IMPORT-AIR-DXB-TRANSPORTATION","IMPORT",13],["LOCAL-DXB-DELIVERY","IMPORT",14],["LOCAL-DXB-UNPACKING","IMPORT",15],["LOCAL-DXB-CRATE-DISPOSAL","IMPORT",16]]},
  {label:"AIR - DTD (INBOUND)",mode:"Air",movement:"Door-to-door",seaLoad:"",direction:"Inbound",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",4],["LOCAL-DXB-DOCUMENTATION","EXPORT",5],["EXPORT-AIR-DXB-AIRPORT-DELIVERY","EXPORT",6],["FREIGHT-OUTBOUND-AIRFREIGHT","EXPORT",7],["IMPORT-AIR-ROW-AIRPORT-COLLECTION","IMPORT",8],["IMPORT-AIR-ROW-AIRPORT-THC","IMPORT",9],["IMPORT-ROW-IMP-CUSTOMS-PERM","IMPORT",10],["IMPORT-ROW-IMP-CUSTOMS-TEMP","IMPORT",11],["LOCAL-ROW-DELIVERY","IMPORT",12],["LOCAL-ROW-DOCUMENTATION","IMPORT",13],["LOCAL-ROW-UNPACKING","IMPORT",14],["LOCAL-ROW-CRATE-DISPOSAL","IMPORT",15]]},
  {label:"AIR - DTD (OUTBOUND)",mode:"Air",movement:"Door-to-door",seaLoad:"",direction:"Outbound",lines:[["LOCAL-ROW-COLLECTION","EXPORT",1],["LOCAL-ROW-PACKING-MATERIAL","EXPORT",2],["LOCAL-ROW-CRATING","EXPORT",3],["LOCAL-ROW-W-H-HANDLING-IN-OUT","EXPORT",4],["EXPORT-ROW-EXP-CUSTOMS-PERM","EXPORT",6],["EXPORT-ROW-EXP-CUSTOMS-TEMP","EXPORT",7],["EXPORT-AIR-ROW-AIRPORT-DELIVERY","EXPORT",8],["FREIGHT-INBOUND-AIRFREIGHT","EXPORT",9],["LOCAL-ROW-DOCUMENTATION","EXPORT, RE-IMPORT",999],["IMPORT-AIR-DXB-AIRPORT-COLLECTION-DXB","IMPORT",10],["IMPORT-AIR-DXB-DOCUMENTATION","IMPORT",11],["IMPORT-AIR-DXB-CUSTOMS","IMPORT",12],["IMPORT-AIR-DXB-TRANSPORTATION","IMPORT",13],["LOCAL-DXB-DELIVERY","IMPORT",14],["LOCAL-DXB-COLLECTION","RE-EXPORT",15],["LOCAL-DXB-PACKING","RE-EXPORT",16],["LOCAL-DXB-CRATING","RE-EXPORT",17],["LOCAL-DXB-W-H-HANDLING-IN-OUT","RE-EXPORT",18],["LOCAL-DXB-DOCUMENTATION","RE-EXPORT",19],["EXPORT-AIR-DXB-AIRPORT-DELIVERY","RE-EXPORT",20],["FREIGHT-OUTBOUND-AIRFREIGHT","RE-EXPORT",21],["IMPORT-AIR-ROW-AIRPORT-COLLECTION","RE-IMPORT",22],["IMPORT-AIR-ROW-AIRPORT-THC","RE-IMPORT",23],["IMPORT-ROW-IMP-CUSTOMS-PERM","RE-IMPORT",24],["IMPORT-ROW-IMP-CUSTOMS-TEMP","RE-IMPORT",25],["LOCAL-ROW-DELIVERY","RE-IMPORT",26],["LOCAL-ROW-UNPACKING","RE-IMPORT",28],["LOCAL-ROW-CRATE-DISPOSAL","RE-IMPORT",29]]},
  {label:"AIR - ROUNDTRIP (INBOUND)",mode:"Air",movement:"Roundtrip",seaLoad:"",direction:"Inbound",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",4],["LOCAL-DXB-DOCUMENTATION","EXPORT",5],["EXPORT-AIR-DXB-AIRPORT-DELIVERY","EXPORT",6],["FREIGHT-OUTBOUND-AIRFREIGHT","EXPORT",7],["IMPORT-AIR-ROW-AIRPORT-COLLECTION","IMPORT",8],["IMPORT-AIR-ROW-AIRPORT-THC","IMPORT",9],["IMPORT-ROW-IMP-CUSTOMS-PERM","IMPORT",10],["IMPORT-ROW-IMP-CUSTOMS-TEMP","IMPORT",11],["LOCAL-ROW-DELIVERY","IMPORT",12],["LOCAL-ROW-UNPACKING","IMPORT",14],["LOCAL-ROW-CRATE-DISPOSAL","IMPORT",15],["LOCAL-ROW-DOCUMENTATION","IMPORT, RE-EXPORT",999],["LOCAL-ROW-COLLECTION","RE-EXPORT",16],["EXPORT-ROW-EXP-CUSTOMS-PERM","RE-EXPORT",21],["EXPORT-ROW-EXP-CUSTOMS-TEMP","RE-EXPORT",22],["EXPORT-AIR-ROW-AIRPORT-DELIVERY","RE-EXPORT",23],["FREIGHT-INBOUND-AIRFREIGHT","RE-EXPORT",24],["LOCAL-ROW-PACKING-MATERIAL","RE-IMPORT",17],["LOCAL-ROW-CRATING","RE-IMPORT",18],["LOCAL-ROW-W-H-HANDLING-IN-OUT","RE-IMPORT",19],["IMPORT-AIR-DXB-AIRPORT-COLLECTION-DXB","RE-IMPORT",25],["IMPORT-AIR-DXB-DOCUMENTATION","RE-IMPORT",26],["IMPORT-AIR-DXB-CUSTOMS","RE-IMPORT",27],["IMPORT-AIR-DXB-TRANSPORTATION","RE-IMPORT",28],["LOCAL-DXB-DELIVERY","RE-IMPORT",29],["LOCAL-DXB-UNPACKING","RE-IMPORT",30]]},
  {label:"AIR - ROUNDTRIP (OUTBOUND)",mode:"Air",movement:"Roundtrip",seaLoad:"",direction:"Outbound",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",4],["LOCAL-DXB-DOCUMENTATION","EXPORT",5],["EXPORT-SEA-DXB-CTR-LOADING","EXPORT",6],["EXPORT-SEA-DXB-PORT-DELIVERY","EXPORT",7],["EXPORT-SEA-DXB-PORT-THC","EXPORT",8],["EXPORT-SEA-DXB-PORT-CHARGES","EXPORT",9],["EXPORT-SEA-DXB-SEC-SCREENING","EXPORT",10],["EXPORT-SEA-DXB-B-L","EXPORT",11],["FREIGHT-OUTBOUND-SEA-FREIGHT-FCL","EXPORT",12]]},
  {label:"SEA - DTP (FCL)",mode:"Sea",movement:"Door-to-port",seaLoad:"FCL",direction:"",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-DOCUMENTATION","EXPORT",4],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",5],["EXPORT-SEA-DXB-CTR-LOADING","EXPORT",6],["EXPORT-SEA-DXB-PORT-DELIVERY","EXPORT",7],["EXPORT-SEA-DXB-PORT-THC","EXPORT",8],["EXPORT-SEA-DXB-PORT-CHARGES","EXPORT",9],["EXPORT-SEA-DXB-SEC-SCREENING","EXPORT",10],["EXPORT-SEA-DXB-B-L","EXPORT",11],["FREIGHT-OUTBOUND-SEA-FREIGHT-LCL","EXPORT",12]]},
  {label:"SEA - DTP (LCL)",mode:"Sea",movement:"Door-to-port",seaLoad:"LCL",direction:"",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-DOCUMENTATION","EXPORT",4],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",5],["EXPORT-SEA-DXB-CTR-LOADING","EXPORT",6],["EXPORT-SEA-DXB-PORT-DELIVERY","EXPORT",7],["EXPORT-SEA-DXB-PORT-THC","EXPORT",8],["EXPORT-SEA-DXB-PORT-CHARGES","EXPORT",9],["EXPORT-SEA-DXB-SEC-SCREENING","EXPORT",10],["EXPORT-SEA-DXB-B-L","EXPORT",11],["FREIGHT-OUTBOUND-SEA-FREIGHT-FCL","EXPORT",12],["IMPORT-ROW-IMP-CUSTOMS-PERM","IMPORT",13],["IMPORT-ROW-IMP-CUSTOMS-TEMP","IMPORT",14],["IMPORT-SEA-ROW-COLLECTION","IMPORT",15],["IMPORT-SEA-ROW-PORT-THC","IMPORT",16],["IMPORT-SEA-ROW-PORT-CHARGES","IMPORT",17],["IMPORT-SEA-ROW-SEC-SCREENING","IMPORT",18],["IMPORT-SEA-ROW-D-O","IMPORT",19],["LOCAL-ROW-DELIVERY","IMPORT",20],["LOCAL-ROW-UNPACKING","IMPORT",21],["LOCAL-ROW-CRATE-DISPOSAL","IMPORT",22]]},
  {label:"SEA - DTD (FCL)",mode:"Sea",movement:"Door-to-door",seaLoad:"FCL",direction:"",lines:[["LOCAL-DXB-COLLECTION","EXPORT",1],["LOCAL-DXB-PACKING","EXPORT",2],["LOCAL-DXB-CRATING","EXPORT",3],["LOCAL-DXB-DOCUMENTATION","EXPORT",4],["LOCAL-DXB-W-H-HANDLING-IN-OUT","EXPORT",5],["EXPORT-SEA-DXB-CTR-LOADING","EXPORT",6],["EXPORT-SEA-DXB-PORT-DELIVERY","EXPORT",7],["EXPORT-SEA-DXB-PORT-THC","EXPORT",8],["EXPORT-SEA-DXB-PORT-CHARGES","EXPORT",9],["EXPORT-SEA-DXB-SEC-SCREENING","EXPORT",10],["EXPORT-SEA-DXB-B-L","EXPORT",11],["FREIGHT-OUTBOUND-SEA-FREIGHT-LCL","EXPORT",12],["IMPORT-ROW-IMP-CUSTOMS-PERM","IMPORT",13],["IMPORT-ROW-IMP-CUSTOMS-TEMP","IMPORT",14],["IMPORT-SEA-ROW-COLLECTION","IMPORT",15],["IMPORT-SEA-ROW-PORT-THC","IMPORT",16],["IMPORT-SEA-ROW-PORT-CHARGES","IMPORT",17],["IMPORT-SEA-ROW-SEC-SCREENING","IMPORT",18],["IMPORT-SEA-ROW-D-O","IMPORT",19],["LOCAL-ROW-DELIVERY","IMPORT",20],["LOCAL-ROW-UNPACKING","IMPORT",21],["LOCAL-ROW-CRATE-DISPOSAL","IMPORT",22]]},
  {label:"SEA - DTD (LCL)",mode:"Sea",movement:"Door-to-door",seaLoad:"LCL",direction:"",lines:[["IMPORT-DXB-IMP-CUSTOMS-PERM","IMPORT",1],["IMPORT-DXB-IMP-CUSTOMS-TEMP","IMPORT",2],["IMPORT-DXB-IMP-INSPECTION","IMPORT",3],["LOCAL-DXB-DOCUMENTATION","IMPORT",4],["IMPORT-SEA-DXB-COLLECTION","IMPORT",5],["IMPORT-SEA-DXB-PORT-THC","IMPORT",6],["IMPORT-SEA-DXB-PORT-CHARGES","IMPORT",7],["LOCAL-DXB-DELIVERY","IMPORT",8],["LOCAL-DXB-UNPACKING","IMPORT",9],["LOCAL-DXB-CRATE-DISPOSAL","IMPORT",10]]},
  {label:"SEA - IMPORT (FLC)",mode:"Sea",movement:"Import",seaLoad:"FCL",direction:"",lines:[["IMPORT-DXB-IMP-CUSTOMS-PERM","IMPORT",1],["IMPORT-DXB-IMP-CUSTOMS-TEMP","IMPORT",2],["IMPORT-DXB-IMP-INSPECTION","IMPORT",3],["LOCAL-DXB-DOCUMENTATION","IMPORT",4],["IMPORT-SEA-DXB-COLLECTION","IMPORT",5],["IMPORT-SEA-DXB-PORT-THC","IMPORT",6],["IMPORT-SEA-DXB-PORT-CHARGES","IMPORT",7],["LOCAL-DXB-DELIVERY","IMPORT",8],["LOCAL-DXB-UNPACKING","IMPORT",9],["LOCAL-DXB-CRATE-DISPOSAL","IMPORT",10]]},
  {label:"SEA - IMPORT (LCL)",mode:"Sea",movement:"Import",seaLoad:"LCL",direction:"",lines:[["LOCAL-DXB-PACKING","SERVICES",1],["LOCAL-DXB-LOCAL-TRANSPORT-D2D","SERVICES",2],["LOCAL-DXB-COLLECTION","SERVICES",3],["LOCAL-DXB-DELIVERY","SERVICES",4],["LOCAL-DXB-UNPACKING","SERVICES",5]]},
  {label:"ROAD (LOCAL)",mode:"Road",movement:"Local",seaLoad:"",direction:"",lines:[["LOCAL-DXB-COLLECTION","SERVICES",1],["LOCAL-DXB-PACKING","SERVICES",2],["LOCAL-DXB-CRATING","SERVICES",3],["LOCAL-DXB-W-H-HANDLING-IN-OUT","SERVICES",4],["LOCAL-DXB-DELIVERY-OTHER-EMIRATES","SERVICES",5],["LOCAL-DXB-TRANSPORT-EMIRATES-D2D","SERVICES",6]]},
  {label:"ROAD  (LONG DISTANCE)",mode:"Road",movement:"Long distance",seaLoad:"",direction:"",lines:[]}
];

/* ============ JOB CLASSIFICATION & LIFECYCLE ============ */
export const JOB_TYPES = ["Export", "Import", "Local", "Project"];
export const JOBTYPE_COLOR = {
  Export: { bg: "#646B00", fg: "#fff", soft: "rgba(100,107,0,.12)" },
  Import: { bg: "#2C2C2C", fg: "#F0FD63", soft: "rgba(44,44,44,.10)" },
  Local: { bg: "#F0FD63", fg: "#1D1D1D", soft: "rgba(240,253,99,.30)" },
  Project: { bg: "#8A8F33", fg: "#fff", soft: "rgba(138,143,51,.14)" },
  Storage: { bg: "#1D1D1D", fg: "#F0FD63", soft: "rgba(29,29,29,.08)" },
  Installation: { bg: "#B8BD7A", fg: "#1D1D1D", soft: "rgba(184,189,122,.18)" },
};
export const jobTypeColor = (t) => JOBTYPE_COLOR[t] || { bg: "#1D1D1D", fg: "#fff", soft: "var(--bg)" };
export const JTYPE_TONE = { Export: "transit", Import: "loan", Local: "consv" };
export const MOVEMENTS = {
  Export: ["Door-to-door", "Door-to-port", "Outbound", "Roundtrip"],
  Import: ["Door-to-door", "Port-to-door", "Inbound", "Roundtrip"],
  Local: ["Local transport", "Warehouse handling", "Installation", "Storage", "Collection move"],
};
export const ALL_MOVEMENTS = Array.from(new Set(Object.values(MOVEMENTS).flat()));
export const MODES = ["Air", "Sea", "Road"];
export const SEA_LOADS = ["FCL", "LCL"];
export const JOB_STATUS = ["Confirmed", "Closed", "Lost", "Cancelled"];
export const JSTATUS_TONE = { Confirmed: "won", Closed: "neutral", Lost: "lost", Cancelled: "lost" };
export const AGENT_ROLES = ["Origin agent", "Destination agent", "Receiving agent", "Network partner"];
export const movementsFor = (t) => MOVEMENTS[t] || ALL_MOVEMENTS;

/* ---- volumetric / airline chargeable weight ---- */
export const VOL_WEIGHT_PER_CBM = { Air: 166.67, Road: 333.33, Sea: 1000 }; // air ÷6000, road ÷3000, sea W/M
export const crateCBM = (l, w, h) => (Number(l) || 0) * (Number(w) || 0) * (Number(h) || 0) / 1e6; // cm → m³
export const volWeight = (cbm, mode) => cbm * (VOL_WEIGHT_PER_CBM[mode] || VOL_WEIGHT_PER_CBM.Air);
export const chargeableKg = (cbm, grossKg, mode) => Math.max(Number(grossKg) || 0, volWeight(cbm, mode));
// rule-based crate estimate from artwork dims (cm); flat works get a shallow case, 3-D works get all-round padding
export function estimateCrate({ w, h, d, flat }) {
  const W = Number(w) || 0, H = Number(h) || 0, D = Number(d) || 0;
  if (flat) return { l: Math.round(W + 20), w: Math.round(H + 20), h: Math.round((D || 5) + 25) };
  return { l: Math.round(W + 25), w: Math.round(H + 25), h: Math.round((D || W) + 25) };
}
export function estimateCrateWeight(cl, cw, ch, artKg) {
  const cbm = crateCBM(cl, cw, ch);
  return Math.round((Number(artKg) || cbm * 60) + cbm * 110); // art + ~110kg/m³ ply tare
}
export const crateTotals = (crates) => (crates || []).reduce((a, c) => {
  const q = Number(c.qty) || 1; const cbm = crateCBM(c.l, c.w, c.h) * q;
  return { count: a.count + q, cbm: a.cbm + cbm, gross: a.gross + (Number(c.weight) || 0) * q };
}, { count: 0, cbm: 0, gross: 0 });

/* ---- billable-service configuration → quote lines ---- */
export const LEG_LABEL = { EXPORT: "Export services", IMPORT: "Import services", "RE-EXPORT": "Re-export services", "RE-IMPORT": "Re-import services", SERVICES: "Services" };
export const LEG_ORDER = ["EXPORT", "IMPORT", "RE-EXPORT", "RE-IMPORT", "SERVICES", "OTHER"];
export const legOf = (g) => { const k = (g || "").split(",")[0].trim().toUpperCase(); return LEG_LABEL[k] ? k : "OTHER"; };
export function configToLines(cfg, totals, catBy) {
  const cbm = Math.round((totals.cbm || 0) * 100) / 100;
  const chg = Math.round(chargeableKg(totals.cbm || 0, totals.gross || 0, cfg.mode || "Air"));
  const crates = totals.count || 1;
  const qtyFor = (svc) => {
    if (!svc) return 1;
    if (svc.drv === "Volume (CBM)") return cbm || 1;
    if (svc.drv === "Chargeable weight") return chg || 1;
    if (svc.drv === "Per crate" || (svc.c2 || "").includes("CRATING")) return crates;
    return 1;
  };
  const isRound = (cfg.movement || "").toLowerCase().includes("round") || (cfg.label || "").toUpperCase().includes("ROUNDTRIP");
  return (cfg.lines || []).slice()
    .filter(([sid, group]) => isRound || !["RE-EXPORT", "RE-IMPORT"].includes(legOf(group)))
    .sort((a, b) => (LEG_ORDER.indexOf(legOf(a[1])) - LEG_ORDER.indexOf(legOf(b[1]))) || (a[2] - b[2]))
    .map(([sid, group, order]) => {
      const svc = (catBy || SERVICE_CAT_BY)[sid] || {};
      return { id: uid(), sid, group: legOf(group), desc: svc.desc || svc.c2 || sid, unit: svc.unit || "", qty: qtyFor(svc), rate: svc.rate || 0, min: svc.min || 0, vat: !!svc.vat, cost: 0, costBasis: "unit", vendorId: "" };
    });
}
export const linesByLeg = (lines) => {
  const map = {}; (lines || []).forEach(l => { const k = l.group && LEG_LABEL[l.group] ? l.group : "OTHER"; (map[k] = map[k] || []).push(l); });
  return LEG_ORDER.filter(k => map[k]).map(k => ({ key: k, label: k === "OTHER" ? "Additional services" : LEG_LABEL[k], items: map[k] }));
};


export const SERVICES_BY_GROUP = SERVICE_GROUPS.map(g => ({ ...g, items: SERVICES.filter(s => s.group === g.key) }));
export const VAT_RATE = 0.05;
export const QUOTE_STATUS = ["Estimating", "Sent", "Won", "Lost", "Cancelled", "Converted"];
export const ARTECO_PARTY = { name: "ARTECO", street: "Dubai Logistics City, Plot WB-12", zip: "", city: "Dubai", country: "United Arab Emirates", contact: "ARTECO Operations", phone: "+971 4 555 0100" };
export function partyAddr(p) { if (!p) return ""; const s = [p.street, [p.zip, p.city].filter(Boolean).join(" "), p.country].filter(Boolean); if (s.length) return s.join(", "); return p.address || ""; }
export function partyOneLine(p) { if (!p) return ""; return [p.name, partyAddr(p), p.contact].filter(Boolean).join(" — "); }
export const QSTATUS_TONE = { Estimating: "transit", Sent: "loan", Won: "storage", Lost: "neutral", Cancelled: "neutral", Converted: "consv" };
export const LEAD_STATUS = ["New", "Contacted", "Qualified", "Quoted", "Lost"];
export const LSTATUS_TONE = { New: "loan", Contacted: "transit", Qualified: "storage", Quoted: "consv", Lost: "neutral" };
export const LEAD_SOURCES = ["Referral", "Website", "Email", "Phone call", "Repeat client", "Art fair", "Network partner"];
/* follow-up cadence after a quote is sent: 1st at +3 days, 2nd at +6 days */
export const FOLLOWUP_DAYS = [3, 6];
export const addDays = (iso, n) => { if (!iso) return null; const d = new Date(iso); if (isNaN(d)) return null; d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export function nextFollowUp(q) {
  if (q.status !== "Sent" || !q.sentDate) return null;
  const done = q.followLog ? q.followLog.length : 0;
  if (done >= FOLLOWUP_DAYS.length) return null;
  const due = addDays(q.sentDate, FOLLOWUP_DAYS[done]);
  return { n: done + 1, due, overdue: daysUntil(due) != null && daysUntil(due) < 0, dueIn: daysUntil(due) };
}
export const PROJECT_TYPES = ["Shipment", "Exhibition", "Collection move", "Storage intake", "Conservation", "Installation"];
export const PROJECT_STATUS = ["Planning", "Active", "On hold", "Completed"];
export const PSTATUS_TONE = { Planning: "loan", Active: "storage", "On hold": "transit", Completed: "neutral" };
export const TASK_TYPES = ["Crating", "Condition", "Transport", "Install", "Customs", "Admin"];
export const TASK_STATUS = ["To do", "In progress", "Done"];
export const TSTATUS_TONE = { "To do": "neutral", "In progress": "transit", Done: "storage" };
export const lineBase = (l) => (Number(l.qty) || 0) * (Number(l.rate) || 0);
export const lineAmt = (l) => { const b = lineBase(l); return b > 0 ? Math.max(b, Number(l.min) || 0) : 0; };
export const quoteSubtotal = (q) => (q.lines || []).reduce((s, l) => s + lineAmt(l), 0);
export const quoteVat = (q) => (q.lines || []).reduce((s, l) => s + (l.vat ? lineAmt(l) * VAT_RATE : 0), 0);
export const quoteTotal = (q) => quoteSubtotal(q) + quoteVat(q);
export const lineCost = (l) => { const c = Number(l.cost) || 0; return l.costBasis === "lump" ? c : (Number(l.qty) || 0) * c; };
export const computeSell = (l, kind, val, basis) => {
  const v = Number(val) || 0; const qty = Number(l.qty) || 1;
  if (basis === "total") { const tc = lineCost(l); const ts = kind === "pct" ? tc * (1 + v / 100) : tc + v; return qty ? ts / qty : ts; }
  const uc = l.costBasis === "lump" ? (qty ? (Number(l.cost) || 0) / qty : 0) : (Number(l.cost) || 0);
  return kind === "pct" ? uc * (1 + v / 100) : uc + v;
};
export const quoteCost = (q) => (q.lines || []).reduce((s, l) => s + lineCost(l), 0);
export const quoteMargin = (q) => quoteSubtotal(q) - quoteCost(q);
export const DEFAULT_EXCLUSIONS = [
  "Customs Inspection Charges (as per outlay, if any)",
  "Airport Supervisions / Storage (at cost, if any)",
  "Difficult access upon delivery / collection",
  "Unpacking / Installation (unless listed above)",
  "Import duties and taxes at destination",
  "Any other services not listed above",
];
export const DEFAULT_TERMS = [
  "The above charges are based on the information provided and can vary if the actual services provided are different.",
  "If not indicated above, our charges exclude transportation insurance as well as import duties and taxes.",
  "We require our customers to attest that they have fully insured the goods we are handling.",
  "Final charges are based on actual volumes indicated on the transportation documents and actual working times and conditions.",
  "The above estimate is based on present tariffs and exchange rates, subject to modifications without pre-advice.",
  "Term of payment is strictly: Payment in advance.",
  "This estimate is valid for 30 days.",
];
export const TEAM_ROLES = ["Art Handler", "Registrar", "Conservator", "Driver", "Coordinator", "Technician", "Packer", "Account Manager", "Finance Officer"];
export const TEAM_FUNCTIONS = ["Sales", "Operations", "Finance", "Coordinator", "Field crew", "Driver", "Packer", "Handler"];
export const USER_ROLES = ["Admin", "Operations", "Dispatcher", "Sales", "Finance", "Field crew"];
export const ROLE_DOMAINS = {
  Admin: null,
  Operations: ["dashboard", "operations", "dispatch", "warehouse", "resources"],
  Dispatcher: ["dashboard", "dispatch", "operations", "resources"],
  Sales: ["dashboard", "commercial", "warehouse"],
  Finance: ["dashboard", "finance", "commercial"],
  "Field crew": ["dashboard", "operations", "dispatch"],
};
export function roleCanSee(role, domainKey) { const allow = ROLE_DOMAINS[role]; return allow == null ? true : allow.includes(domainKey); }
// Only the dispatcher (and admin) may allocate real resources to a job.
export function canAllocate(role) { return role === "Dispatcher" || role === "Admin"; }
// Resource request: the operator/client manager states what the job NEEDS, by function/type + counts.
export const REQUEST_FUNCTIONS = ["Senior technician", "Handler", "Packer", "Driver", "Conservator", "Supervisor"];
export const REQUEST_FLEET = ["Climate truck", "Box van", "Shuttle", "Flatbed"];
export const REQUEST_EQUIP = ["Forklift", "Gantry crane", "Soft-skin dollies", "Climate loggers", "Vacuum lift"];
export const PERSON_STATUS = ["Available", "On job", "Off"];
export const PERSON_TONE = { Available: "storage", "On job": "transit", Off: "neutral" };
export const FLEET_TYPES = ["Climate truck", "Box van", "Shuttle", "Trailer"];
export const ASSET_STATUS = ["Available", "On job", "Maintenance"];
export const ASSET_TONE = { Available: "storage", "On job": "transit", Maintenance: "loan", "In use": "transit" };
export const VENDOR_CATS = ["Shipping", "Customs", "Conservation", "Crating", "Insurance", "Materials"];
export const INVOICE_STATUS = ["Draft", "Sent", "Paid", "Overdue"];
export const INV_TONE = { Draft: "neutral", Sent: "loan", Paid: "storage", Overdue: "transit" };


export const STATUSES = ["In stock", "In transit", "Out"];
export const CUSTODY = ["In custody", "Provisional", "Departed"];
export const CUSTOMS = ["Bonded", "Temporary Admission", "Duty Paid", "Free Zone", "N/A"];
export const PACKAGE_TYPES = ["Crate", "Travel frame", "Flat case", "Portfolio case", "Pallet", "Soft-pack", "Tube", "Climate case"];
export const LOC_TYPES = ["Bonded Warehouse", "Climate Store", "Standard Store", "In Transit", "Exhibition Venue", "Conservation Studio", "Client Site"];
export const MOVE_TYPES = ["Intake", "Internal Move", "Outbound", "Return", "To Conservator", "From Conservator"];
export const SPACE_KINDS = ["warehouse", "zone", "rack", "module", "receive", "release"];
export const SPACE_LABEL = { warehouse: "Warehouse", zone: "Zone / area", rack: "Rack", module: "Module / shelf", receive: "Receiving area", release: "Release area" };
export const SPACE_CHILDREN = { warehouse: ["zone", "receive", "release"], zone: ["rack", "module"], rack: ["module"], module: [], receive: [], release: [] };
export const BILLING_MODELS = ["Volume", "Area", "Fixed"];
export const PERIODS = ["Monthly", "Quarterly", "Annual"];
export const periodsPerYear = (p) => p === "Monthly" ? 12 : p === "Quarterly" ? 4 : p === "Weekly" ? 52 : p === "Annually" ? 1 : 12;
export const STORAGE_BASIS = ["Volume (m³)", "Area (m²)", "Pallet/position", "Fixed"];
export const STORAGE_FREQ = ["Weekly", "Monthly", "Quarterly", "Annually"];
export const SACCT_STATUS = ["Active", "On hold", "Closed"];
export const SASTATUS_TONE = { Active: "storage", "On hold": "loan", Closed: "neutral" };

/* ----------------------------- helpers ----------------------------------- */
