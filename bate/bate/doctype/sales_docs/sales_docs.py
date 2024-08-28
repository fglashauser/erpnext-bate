import frappe
import json

@frappe.whitelist()
def get_unique_sizes(doc):
    doc = json.loads(doc)
    unique_sizes = set()

    # Iteriere über alle Einträge in der "items"-Child-Tabelle
    for item in doc.get("items", []):
        if item.get("sizes"):
            # Parsen des JSON-Feldes
            sizes = json.loads(item.get("sizes"))
            # Füge nur die Größen (ohne Mengen) zur Liste hinzu
            for size in sizes.keys():
                # Entferne 'amount_' von den Schlüsselnamen, um die reine Größe zu erhalten
                size_name = size.replace("amount_", "")
                unique_sizes.add(size_name)

    # Zurückgeben einer sortierten Liste von einmaligen Größen
    return sorted(list(unique_sizes))

@frappe.whitelist()
def get_sizes_amount(doc):
    """
    Gibt die Mengen der Größen für alle Artikel zurück.
    """
    # Alle (einzigarten) Größen holen
    all_sizes = get_unique_sizes(doc)

    doc = json.loads(doc)
    sizes_amount = []

    # Iteriere über alle Artikel
    for item in doc.get("items", []):
        item_sizes_amount = []
        sizes = json.loads(item.get("sizes"))
        for size in all_sizes:

            # Füge die Menge zur Liste hinzu
            item_sizes_amount.append(sizes.get(f"amount_{size}", 0))
            
        sizes_amount.append(item_sizes_amount)

    return sizes_amount