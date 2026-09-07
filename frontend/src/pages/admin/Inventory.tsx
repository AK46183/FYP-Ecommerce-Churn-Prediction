import { PageTitle } from '@/components/admin/AdminUI'
import { products, hasVariantPricing } from '@/data/products'
import { AlertTriangle, CheckCircle, Package } from 'lucide-react'
import { usdToPkr } from '@/utils/currency'

function formatCompactPKR(usdValue: number) {
  const pkr = usdToPkr(usdValue)

  if (pkr >= 1_000_000_000) {
    return `Rs. ${(pkr / 1_000_000_000).toFixed(1)}B`
  }

  if (pkr >= 1_000_000) {
    return `Rs. ${(pkr / 1_000_000).toFixed(1)}M`
  }

  if (pkr >= 1_000) {
    return `Rs. ${(pkr / 1_000).toFixed(0)}K`
  }

  return `Rs. ${pkr.toLocaleString('en-PK')}`
}

export default function Inventory() {
  const withVariants = products.filter((p) => hasVariantPricing(p))
  const withoutVariants = products.filter((p) => !hasVariantPricing(p))

  const lowStock = withoutVariants
    .filter((p) => p.stock < 15)
    .sort((a, b) => a.stock - b.stock)

  const inStock = withoutVariants.filter((p) => p.stock >= 15)

  // Keeps the existing inventory grouping logic intact.
  void inStock

  const variantLowStock = withVariants
    .flatMap((p) =>
      (p.variantConfigs ?? []).map((cfg) => ({
        productName: p.name,
        brand: p.brand,
        config: Object.values(cfg.values).join(' / '),
        stock: cfg.stock,
        sku: cfg.sku,
      })),
    )
    .filter((v) => v.stock < 10)
    .sort((a, b) => a.stock - b.stock)

  const totalValue = products.reduce(
    (sum, p) => {
      if (p.variantConfigs?.length) {
        return (
          sum +
          p.variantConfigs.reduce(
            (s, c) => s + c.price * c.stock,
            0,
          )
        )
      }

      return sum + p.price * p.stock
    },
    0,
  )

  return (
    <div>
      <PageTitle
        title="Inventory"
        subtitle="Monitor and manage stock levels"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-accent-300" />

            <div>
              <p className="font-display text-2xl font-semibold text-white">
                {products.length}
              </p>

              <p className="text-xs text-white/40">
                Total Products
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />

            <div>
              <p className="font-display text-2xl font-semibold text-white">
                {lowStock.length + variantLowStock.length}
              </p>

              <p className="text-xs text-white/40">
                Low Stock Items
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />

            <div>
              <p className="font-display text-2xl font-semibold text-white">
                {formatCompactPKR(totalValue)}
              </p>

              <p className="text-xs text-white/40">
                Inventory Value
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Variant-based low stock */}

      {variantLowStock.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
          <div className="border-b border-white/[0.06] p-4">
            <h3 className="font-display text-base font-semibold text-white">
              Variant Low Stock ({variantLowStock.length})
            </h3>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {variantLowStock.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {v.productName}
                  </p>

                  <p className="text-xs text-white/40">
                    {v.brand} · {v.config} · SKU: {v.sku}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        v.stock < 5
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {v.stock} units
                    </p>
                  </div>

                  <div className="h-2 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full ${
                        v.stock < 5
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          (v.stock / 20) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple product low stock */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
        <div className="border-b border-white/[0.06] p-4">
          <h3 className="font-display text-base font-semibold text-white">
            Low Stock Alert ({lowStock.length})
          </h3>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {lowStock.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {p.name}
                </p>

                <p className="text-xs text-white/40">
                  {p.brand}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      p.stock < 10
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {p.stock} units
                  </p>

                  <p className="text-xs text-white/30">
                    Max: {p.stock + 50}
                  </p>
                </div>

                <div className="h-2 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full ${
                      p.stock < 10
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (p.stock / 50) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {lowStock.length === 0 && (
            <div className="p-8 text-center text-sm text-white/40">
              All simple products are well stocked.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}