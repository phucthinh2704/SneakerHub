const products = require("./product.json");

// ==========================
// 2) HÀM CHECK TRÙNG
// ==========================
function auditDuplicates(products) {
  const slugMap = new Map();      // slug -> [{ productName, pIndex }]
  const skuMap = new Map();       // sku -> [{ productSlug, productName, color, pIndex, vIndex }]
  const skuSizeMap = new Map();   // `${sku}__${size}` -> [{ ... }]

  const pushToMap = (map, key, value) => {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(value);
  };

  products.forEach((p, pIndex) => {
    // 1) product.slug
    const slug = String(p?.slug || "").trim();
    if (slug) {
      pushToMap(slugMap, slug, { productName: p?.name, slug, pIndex });
    }

    // variants
    (p?.variants || []).forEach((v, vIndex) => {
      // 2) variant.sku
      const sku = String(v?.sku || "").trim();
      if (sku) {
        pushToMap(skuMap, sku, {
          sku,
          productSlug: p?.slug,
          productName: p?.name,
          color: v?.color,
          pIndex,
          vIndex,
        });
      }

      // 3) sku + size
      (v?.sizes || []).forEach((s, sIndex) => {
        const sizeVal = s?.size;
        if (!sku || sizeVal === undefined || sizeVal === null) return;

        const key = `${sku}__${sizeVal}`;
        pushToMap(skuSizeMap, key, {
          sku,
          size: sizeVal,
          productSlug: p?.slug,
          productName: p?.name,
          color: v?.color,
          quantity: s?.quantity,
          pIndex,
          vIndex,
          sIndex,
        });
      });
    });
  });

  const getDuplicates = (map) =>
    Array.from(map.entries())
      .filter(([, arr]) => arr.length > 1)
      .map(([key, occurrences]) => ({ key, occurrences }));

  return {
    duplicateSlugs: getDuplicates(slugMap),
    duplicateSkus: getDuplicates(skuMap),
    duplicateSkuSizes: getDuplicates(skuSizeMap),
  };
}

// ==========================
// 3) IN KẾT QUẢ
// ==========================
function printSection(title, arr, keyLabel = "KEY") {
  if (!arr.length) {
    console.log(`✅ ${title}: không có trùng`);
    return;
  }

  console.log(`❌ ${title}: có ${arr.length} case trùng`);
  arr.forEach((item) => {
    console.log(`\n${keyLabel}: ${item.key} (x${item.occurrences.length})`);
    item.occurrences.forEach((o) => {
      console.log(
        ` - ${o.productName} (${o.productSlug || o.slug}) | color: ${o.color ?? "-"} | at products[${o.pIndex}]` +
          (o.vIndex !== undefined ? `.variants[${o.vIndex}]` : "") +
          (o.sIndex !== undefined ? `.sizes[${o.sIndex}]` : "")
      );
    });
  });
}

// ==========================
// 4) CHẠY CHECK
// ==========================
const report = auditDuplicates(products);

printSection("Duplicate product.slug", report.duplicateSlugs, "slug");
printSection("Duplicate variant.sku", report.duplicateSkus, "sku");
printSection("Duplicate (sku + size)", report.duplicateSkuSizes, "sku__size");

// (Tuỳ chọn) Fail script nếu có trùng (hữu ích cho CI/build)
if (
  report.duplicateSlugs.length ||
  report.duplicateSkus.length ||
  report.duplicateSkuSizes.length
) {
  process.exitCode = 1;
  console.log("\n❗ Duplicate check FAILED (exit code 1).");
} else {
  console.log("\n✅ Duplicate check PASSED.");
}
