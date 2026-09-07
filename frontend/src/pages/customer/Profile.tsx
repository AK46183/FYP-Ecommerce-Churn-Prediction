import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'

import {
  motion,
} from 'framer-motion'

import {
  Bell,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react'

import {
  useStore,
} from '@/context/StoreContext'

import {
  formatPKR,
} from '@/utils/currency'

const sidebarItems = [
  {
    label:
      'Profile Details',
    to:
      '/profile',
    icon:
      User,
    end:
      true,
  },
  {
    label:
      'My Orders',
    to:
      '/orders',
    icon:
      ShoppingBag,
  },
  {
    label:
      'Wishlist',
    to:
      '/wishlist',
    icon:
      Heart,
  },
  {
    label:
      'Saved Addresses',
    to:
      '/profile/addresses',
    icon:
      MapPin,
  },
  {
    label:
      'Payment Methods',
    to:
      '/profile/payments',
    icon:
      CreditCard,
  },
  {
    label:
      'Notifications',
    to:
      '/notifications',
    icon:
      Bell,
  },
  {
    label:
      'Settings',
    to:
      '/profile/settings',
    icon:
      Settings,
  },
]

export default function Profile() {
  const {
    user,
    logout,
  } = useStore()

  const navigate =
    useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const profileStats = [
    {
      label:
        'Total Orders',
      value:
        '12',
    },
    {
      label:
        'Wishlist Items',
      value:
        '5',
    },
    {
      label:
        'Total Spent',
      value:
        formatPKR(8420),
    },
  ]

  return (
    <div className="pt-20">

      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="border-b border-white/[0.06] bg-ink-900/40">

        <div className="container-wide section-pad py-10">

          <p className="mb-2 text-sm text-white/40">
            Home / Profile
          </p>

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-400/20 text-2xl font-semibold text-accent-300">

              {user?.name?.[0] ||
                'U'}

            </div>

            <div>

              <h1 className="font-display text-2xl font-semibold text-white">
                {user?.name ||
                  'User'}
              </h1>

              <p className="text-sm text-white/40">
                {user?.email}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          PROFILE CONTENT
      ================================================= */}

      <div className="container-wide section-pad py-10">

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* =============================================
              SIDEBAR
          ============================================= */}

          <aside className="space-y-1">

            {sidebarItems.map(
              (
                item,
              ) => (

                <NavLink
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  end={
                    item.end
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition-colors

                      ${
                        isActive
                          ? 'bg-accent-400/10 text-accent-300'
                          : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                      }
                    `
                  }
                >

                  <item.icon className="h-4 w-4" />

                  {
                    item.label
                  }

                </NavLink>

              ),
            )}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                text-white/50
                transition-colors
                hover:bg-rose-500/10
                hover:text-rose-400
              "
            >

              <LogOut className="h-4 w-4" />

              Logout

            </button>

          </aside>

          {/* =============================================
              MAIN CONTENT
          ============================================= */}

          <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6 sm:p-8">

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >

              <h2 className="font-display text-xl font-semibold text-white">
                Profile Details
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Manage your account information
              </p>

              {/* =========================================
                  PROFILE FORM
              ========================================= */}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">
                    Full Name
                  </label>

                  <input
                    className="input-field"
                    defaultValue={
                      user?.name ||
                      ''
                    }
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">
                    Email
                  </label>

                  <input
                    className="input-field"
                    defaultValue={
                      user?.email ||
                      ''
                    }
                    disabled
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">
                    Phone
                  </label>

                  <input
                    className="input-field"
                    placeholder="+92 300 1234567"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">
                    Date of Birth
                  </label>

                  <input
                    className="input-field"
                    type="date"
                  />

                </div>

              </div>

              <div className="mt-6">

                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40">
                  Address
                </label>

                <input
                  className="input-field"
                  placeholder="Enter your address"
                />

              </div>

              <button
                type="button"
                className="btn-accent mt-6"
              >
                Save Changes
              </button>

              {/* =========================================
                  STATS
              ========================================= */}

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6">

                {profileStats.map(
                  (
                    stat,
                  ) => (

                    <div
                      key={
                        stat.label
                      }
                      className="text-center"
                    >

                      <p className="font-display text-2xl font-semibold text-white">
                        {
                          stat.value
                        }
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {
                          stat.label
                        }
                      </p>

                    </div>

                  ),
                )}

              </div>

              <Outlet />

            </motion.div>

          </div>

        </div>

      </div>

    </div>
  )
}