---
subject: Välkommen till retreaten "{{{ retreat.name }}}" | referens {{{ order.id }}}
---

{{#expect retreat, order }}

Hej{{#if order.name }} {{{ order.name }}}{{/if}},

Tack för din bokning för retreaten "{{{ retreat.name }}}". Din betalning har nu mottagits och ett kvitto har skickats
med ett separat mail.

Retreaten startar {{# format date=retreat.startDate format="dd MMMM yyyy" }}, närmare information kommer skickas ut när
retreaten närmar sig.

Vill du uppdatera eller kompletera informationen du lämnade i samband med din bokning kan du göra det via din [order
sida]({{#url parts=["/order", order.id] }}).

Du kan svara på detta mail om du vill. Om du vill komma kontakt med oss på annat sätt och har frågor gällande din
bokning ska du uppge bokningsnumret **{{{ order.id }}}**.
