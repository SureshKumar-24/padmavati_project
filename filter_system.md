# 🧩 **Filter System Documentation (MD)**
*Brass & Copper Handicraft Store – Filtering Logic & Specification*

---

# ## **1. Overview**
The filter system allows users to refine products based on:
- Metal Type
- Category / Deity
- Price Range
- Weight Range
- Height (Inches)
- Finish Type

Filters update results **instantly** without page reload (AJAX or client-side state updates).

---

# ## **2. Filter Structure (High-Level)**
```
Metal → Category → Filters → Product Grid
```

**Metal selection** determines available categories.  
**Category selection** determines available filter values.  
**Filters** refine the product list.

---

# ## **3. Step-by-Step Flow**

## ### **Step 1 — Select Metal**
User chooses the base product type.

**Available Metals:**
- Brass
- Copper
- Panchdhatu
- Bronze (optional)
- Custom (made-to-order)

**Behavior:**
- Load all categories belonging to selected metal.
- Reset filters if metal is changed.

---

## ### **Step 2 — Select Category**
Dynamic categories based on selected metal.

**Examples:**
- Ganesh
- Laxmi
- Hanuman
- Buddha
- Yantra
- Diyas
- Brackets
- Temple Items

**Behavior:**
- Show products within that metal + category.
- Display available filter values from database.

---

# ## **4. Available Filters (Full Spec)**
Each filter is optional but improves narrowing results.

---

## ### **A. Price Filter**
**Type:** Range slider or two text fields (min–max).  
**Stored in DB:** `price` (numeric)

**Examples:**
- ₹200 – ₹500
- ₹1000 – ₹5000
- Custom user input

**Logic:**
```
WHERE price >= min AND price <= max
```

---

## ### **B. Weight Filter (kg)**
**Type:** Range slider.

**Stored in DB:** `weight_kg` (decimal or float)

**Examples:**
- 1 kg – 3 kg
- 5 kg – 10 kg
- 10 kg – 20 kg

**Logic:**
```
WHERE weight_kg >= min AND weight_kg <= max
```

---

## ### **C. Height Filter (Inches)**
**Type:** Range slider OR preset values.

**Stored in DB:** `height_inch` (integer)

**Examples:**
- 5”
- 12”
- 18”
- 24”+

**Logic:**
```
WHERE height_inch >= min AND height_inch <= max
```

---

## ### **D. Finish Filter**
**Type:** Multi-select dropdown.

**Possible Options:**
- Antique
- Glossy
- Matte
- Gold-plated
- Dual polish

**Stored in DB:** `finish_type` (enum)

**Logic:**
```
WHERE finish_type IN (selected_filters)
```

---

# ## **5. Combined Query Behavior**
When multiple filters are selected, they stack using **AND** conditions.

### Example Combined Query Logic
```
SELECT * FROM products
WHERE metal = 'Brass'
  AND category = 'Ganesh'
  AND price BETWEEN 500 AND 2000
  AND weight_kg BETWEEN 2 AND 8
  AND height_inch >= 10
  AND finish_type = 'Antique'
```

---

# ## **6. UI Wireframe for Filter Panel (Text Version)**
```
---------------------------------------
[ Metal ▼ ]
[ Category ▼ ]

Price Range:   ( ₹200 — ₹5000 )
Weight (kg):   ( 1kg — 10kg )
Height (inch): ( 5" — 24" )
Finish Type:   [Antique] [Matte] [Glossy]

[ Reset Filters ]      [ Apply ]
---------------------------------------
```

Product grid updates in real time.

---

# ## **7. API Structure (Recommended)**
### Endpoint:
```
GET /api/products
```

### Query Params:
```
?metal=Brass
&category=Ganesh
&price_min=200
&price_max=500
&weight_min=2
&weight_max=10
&height_min=5
&height_max=20
&finish=Antique
```

### Response (Example):
```
{
  "products": [
    {
      "id": 101,
      "name": "Brass Ganesha",
      "price": 450,
      "weight_kg": 2.8,
      "height_inch": 12,
      "finish_type": "Antique",
      "image": "url"
    }
  ]
}
```

---

# ## **8. Database Schema (Suggested)**
```
products (
  id INT PK,
  name TEXT,
  metal ENUM('Brass','Copper','Panchdhatu','Custom'),
  category TEXT,
  price DECIMAL,
  weight_kg FLOAT,
  height_inch INT,
  finish_type ENUM('Antique','Glossy','Matte','Gold-plated'),
  stock INT,
  images JSONB,
  description TEXT,
  created_at TIMESTAMP
)
```

---

# ## **9. Filter Reset Logic**
### When user changes metal:
- Reset category
- Reset all filters
- Load new categories

### When user changes category:
- Keep metal
- Keep applied filters
- Update available ranges

### Reset Button:
- Clears all filters except selected metal

---

# ## **10. Performance Notes**
### Recommendations:
- Use **debounce (300ms)** to avoid spam API calls
- Preload category-based filter metadata
- Store filters in URL for sharing
- Cache previous filter results

---

# 🎉 **Filter System MD Documentation Complete**
If you want next:
- **Admin panel MD docs**
- **Database ER diagram MD**
- **Sitemap MD**
- **API documentation MD**

Tell me which one to generate!

