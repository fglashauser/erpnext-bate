function setup(frm) {
    // frm.set_query("items.zusammenstellung", function() {
    //     return {
    //         filters: {
    //             ""
    //         }
    //     })
    // TODO: Implement Filter for "items.zusammenstellung"
}

function refresh(frm) {
    // Button: Größen / Mengen bearbeiten
    frm.fields_dict["items"].grid.add_custom_button('Größen / Mengen bearbeiten', function() {
        var selected_row_name = frm.fields_dict["items"].grid.get_selected()[0];
        if (selected_row_name) {

            // Ausgewählte Zeile holen
            var selected_row = locals[frm.doc.doctype + ' Item'][selected_row_name];

            // Überprüfen, ob der Artikel vorhanden ist
            if (selected_row.item_code) {

                // Lade die Größen basierend auf dem Artikelcode
                frappe.call({
                    method: "bate.bate.doctype.item.item.get_sizes",
                    args: {
                        item_code: selected_row.item_code
                    },
                    callback: function(r) {
                        if (r.message) {
                            var sizes = r.message;
                            var stored_values = {};

                            // Überprüfen, ob das Feld "sizes" gesetzt ist und JSON-Werte enthält
                            if (selected_row.sizes) {
                                stored_values = JSON.parse(selected_row.sizes);
                            }

                            // Öffne das Dialogfenster zur Größeneingabe
                            var d = new frappe.ui.Dialog({
                                title: 'Mengen eingeben für Artikel ' + selected_row.item_code + ' - ' + selected_row.item_name,
                                fields: sizes.map(size => {
                                    return {
                                        label: size.name,
                                        fieldname: 'amount_' + size.name,
                                        fieldtype: 'Int',
                                        default: stored_values['amount_' + size.name] || 0
                                    };
                                }),
                                primary_action_label: 'Speichern',
                                primary_action(values) {

                                    // Mengen der Größen speichern
                                    frappe.model.set_value(selected_row.doctype, selected_row.name, 'sizes', JSON.stringify(values));

                                    // Größen-Anzeige aktualisieren
                                    var display_text = sizes.map(size => {
                                        return size.name + ': ' + (values['amount_' + size.name] !== undefined ? values['amount_' + size.name] : '0');
                                    }).join(' | ');
                                    frappe.model.set_value(selected_row.doctype, selected_row.name, 'sizes_display', display_text);

                                    // Gesamtmenge aktualisieren
                                    var total_amount = sizes.reduce((acc, size) => {
                                        return acc + (values['amount_' + size.name] || 0);
                                    }, 0);
                                    frappe.model.set_value(selected_row.doctype, selected_row.name, 'qty', total_amount);

                                    frm.refresh_field('items');
                                    d.hide();
                                }
                            });
                            d.show();
                        }
                    }
                });
            } else {
                frappe.msgprint(__('Bitte wählen Sie zuerst einen Artikel aus.'));
            }
        } else {
            frappe.msgprint(__('Bitte wählen Sie eine Zeile aus.'));
        }
    });
}

frappe.ui.form.on("Quotation", { setup: setup, refresh: refresh });
frappe.ui.form.on("Sales Order", { refresh: refresh });
frappe.ui.form.on("Sales Invoice", { refresh: refresh });
frappe.ui.form.on("Delivery Note", { refresh: refresh });
frappe.ui.form.on("Purchase Order", { refresh: refresh });
//frappe.ui.form.on("Dunning", { refresh: refresh });