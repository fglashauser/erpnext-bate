import frappe

def insert_default_standards(doc, method):
    """
    Fügt die Standard Vorbelegungen aus den BATE Einstellungen in den neu erstellten Artikel ein.
    """
    settings = frappe.get_single("BATE Einstellungen")

    # Größen kopieren
    for item in settings.item_groessen:
        doc.append("groessen", item.as_dict())

    # Zusammenstellungen kopieren
    for item in settings.item_zusammenstellungen:
        doc.append("zusammenstellungen", item.as_dict())

@frappe.whitelist()
def get_sizes(item_code):
    """
    Gibt die Größen des Artikels zurück.
    """
    item = frappe.get_doc("Item", item_code)
    sizes = []
    if item.groessen:
        for row in item.groessen:
            sizes.append({"name": row.size})
    return sizes