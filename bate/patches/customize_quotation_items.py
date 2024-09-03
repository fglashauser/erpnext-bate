import frappe

def execute():
    # Ändere die Sichtbarkeit der Spalten in der Quotation-Item-Tabelle
    fields_to_show = ["item_code", "item_name", "zusammenstellung", "qty", "rate", "amount"]
    
    # Hole alle relevanten DocField-Einträge für Quotation Item
    for field in fields_to_show:
        frappe.db.set_value(
            "DocField",
            {"parent": "Quotation Item", "fieldname": field},
            "in_list_view",
            1
        )
    
    # Felder, die nicht sichtbar sein sollen, ausblenden
    fields_to_hide = ["description", "uom", "stock_uom"]
    for field in fields_to_hide:
        frappe.db.set_value(
            "DocField",
            {"parent": "Quotation Item", "fieldname": field},
            "in_list_view",
            0
        )
    
    frappe.clear_cache(doctype="Quotation")
