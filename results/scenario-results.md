# Scenario Results

## S01 — qa

_Natural-language question answerable from the catalog (and/or specs)._

**Prompt:** Which payment APIs are production-ready?

**Tool chosen:** productionPaymentApis

**Answer:**

```
4 payment APIs are production-ready: payments-api, payouts-api, ledger-api, fx-rates-api.
```

## S02 — qa

_Natural-language question answerable from the catalog (and/or specs)._

**Prompt:** What depends on the ledger-api? I want to know what breaks if I take it down.

**Tool chosen:** allDependents

**Answer:**

```
16 APIs depend on ledger-api in total (direct and indirect): payments-api, payouts-api, refunds-api, invoicing-api, loyalty-rewards-api, points-api, gift-cards-api, orders-api, checkout-api, subscriptions-api, dunning-api, marketplace-api, returns-api, support-tickets-api, partner-gateway-api, chatbot-api.
```

## S03 — qa

_Natural-language question answerable from the catalog (and/or specs)._

**Prompt:** Which APIs are exposed externally but not behind a gateway?

**Tool chosen:** externalApisWithoutGateway

**Answer:**

```
No externally-tagged APIs are missing a gateway.
```

## S04 — qa

_Natural-language question answerable from the catalog (and/or specs)._

**Prompt:** Which deprecated APIs are still being depended on by active APIs?

**Tool chosen:** deprecatedApisWithActiveDependents

**Answer:**

```
No deprecated APIs are still depended on by active APIs.
```

## S05 — qa

_Natural-language question answerable from the catalog (and/or specs)._

**Prompt:** I'm building a feature that sends a customer an SMS when their order ships. Which APIs do I need?

**Tool chosen:** searchApis

**Answer:**

```
Found 8 APIs related to "SMS, notification, order, shipping": orders-api, cart-api (no spec on file), checkout-api (no spec on file), returns-api (no spec on file), shipping-api, carrier-rates-api (no spec on file), notifications-api, sms-api (no spec on file).
```

## S06 — assess

_Assess the quality of a spec (or compare/rank specs) against the rubric._

**Prompt:** What's wrong with the inventory-api spec? Give me concrete fixes.

**Tool chosen:** whatIsWrong

**Answer:**

```
inventory-api scored 78/100. Problems found:
- [DOC-01, medium]
    - Missing description at Path: /stock, Method: GET
    - Missing description at Path: /stock/{sku}, Method: GET
    - Missing description at Path: /stock/{sku}/adjustments, Method: GET
    - Missing description at Path: /stock/{sku}/adjustments, Method: POST
    - Missing description at Path: /warehouses, Method: GET
    - Missing description at Path: /warehouses/{warehouseId}/stock, Method: GET
- [DOC-02, low]
    - Parameter "limit" in Path: /stock, Method: GET is missing a description.
    - Parameter "offset" in Path: /stock, Method: GET is missing a description.
    - Parameter "warehouseId" in Path: /stock, Method: GET is missing a description.
    - Parameter "sku" in Path: /stock/{sku}, Method: GET is missing a description.
    - Parameter "sku" in Path: /stock/{sku}/adjustments, Method: GET is missing a description.
    - Parameter "limit" in Path: /stock/{sku}/adjustments, Method: GET is missing a description.
    - Parameter "sku" in Path: /stock/{sku}/adjustments, Method: POST is missing a description.
    - Parameter "limit" in Path: /warehouses, Method: GET is missing a description.
    - Parameter "offset" in Path: /warehouses, Method: GET is missing a description.
    - Parameter "warehouseId" in Path: /warehouses/{warehouseId}/stock, Method: GET is missing a description.
    - Parameter "limit" in Path: /warehouses/{warehouseId}/stock, Method: GET is missing a description.
    - Property "sku" in schema "StockLevel" is missing a description.
    - Property "warehouseId" in schema "StockLevel" is missing a description.
    - Property "quantityOnHand" in schema "StockLevel" is missing a description.
    - Property "quantityReserved" in schema "StockLevel" is missing a description.
    - Property "quantityAvailable" in schema "StockLevel" is missing a description.
    - Property "updatedAt" in schema "StockLevel" is missing a description.
    - Property "warehouseId" in schema "Warehouse" is missing a description.
    - Property "name" in schema "Warehouse" is missing a description.
    - Property "region" in schema "Warehouse" is missing a description.
    - Property "active" in schema "Warehouse" is missing a description.
    - Property "adjustmentId" in schema "Adjustment" is missing a description.
    - Property "sku" in schema "Adjustment" is missing a description.
    - Property "warehouseId" in schema "Adjustment" is missing a description.
    - Property "delta" in schema "Adjustment" is missing a description.
    - Property "reason" in schema "Adjustment" is missing a description.
    - Property "createdAt" in schema "Adjustment" is missing a description.
    - Property "warehouseId" in schema "AdjustmentRequest" is missing a description.
    - Property "delta" in schema "AdjustmentRequest" is missing a description.
    - Property "reason" in schema "AdjustmentRequest" is missing a description.
    - Property "code" in schema "Error" is missing a description.
    - Property "message" in schema "Error" is missing a description.
- [DOC-03, low]
    - Response 200 for Path: /stock, Method: GET is missing examples.
    - Response 200 for Path: /stock/{sku}, Method: GET is missing examples.
    - Response 200 for Path: /stock/{sku}/adjustments, Method: GET is missing examples.
    - Request body for Path: /stock/{sku}/adjustments, Method: POST is missing examples.
    - Response 201 for Path: /stock/{sku}/adjustments, Method: POST is missing examples.
    - Response 200 for Path: /warehouses, Method: GET is missing examples.
    - Response 200 for Path: /warehouses/{warehouseId}/stock, Method: GET is missing examples.
- [CMP-03, low]
    - Specification is missing info.contact.
```

## S07 — assess

_Assess the quality of a spec (or compare/rank specs) against the rubric._

**Prompt:** Does the shipping-api spec have any security problems?

**Tool chosen:** securityIssues

**Answer:**

```
shipping-api has 3 security issue(s):
- [SEC-01]
- [SEC-02]
    - Path: /shipments, Method: GET does not have security defined.
    - Path: /shipments, Method: POST does not have security defined.
    - Path: /shipments/{shipmentId}, Method: GET does not have security defined.
    - Path: /shipments/{shipmentId}, Method: DELETE does not have security defined.
    - Path: /rates, Method: POST does not have security defined.
    - Path: /labels, Method: POST does not have security defined.
- [SEC-03]
    - Server URL: http://api.example.com/v1 is not using HTTPS.
```

## S08 — assess

_Assess the quality of a spec (or compare/rank specs) against the rubric._

**Prompt:** Rank all the specs from best to worst quality.

**Tool chosen:** rankAllSpecs

**Answer:**

```
Specs ranked best to worst:
1. payments-api (100)
2. analytics-events-api (83)
3. identity-api (83)
4. inventory-api (78)
5. orders-api (78)
6. notifications-api (70)
7. customer-api (65)
8. loyalty-rewards-api (61)
9. fraud-detection-api (57)
10. shipping-api (57)
```

## S09 — ambiguous

_Underspecified, ambiguous, or partly-unanswerable — the right move may be to ask a clarifying question, state assumptions, or say what's missing._

**Prompt:** Is the billing API any good?

**Tool chosen:** searchApis

**Answer:**

```
Found 3 APIs related to "billing": invoicing-api (no spec on file), subscriptions-api (no spec on file), dunning-api (no spec on file).
```

## S10 — ambiguous

_Underspecified, ambiguous, or partly-unanswerable — the right move may be to ask a clarifying question, state assumptions, or say what's missing._

**Prompt:** Give me the spec for the search service so I can call its checkout endpoint.

**Tool chosen:** searchApis

**Answer:**

```
Found 1 APIs related to "search": search-api (no spec on file).
```
