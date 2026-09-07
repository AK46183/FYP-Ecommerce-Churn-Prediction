import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import {
  Bot,
  Heart,
  Send,
  Sparkles,
  TrendingUp,
  User as UserIcon,
  X,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  generateMockResponse,
} from '@/services/chatbotService'

import {
  getMinPrice,
  getProductById,
  hasVariantPricing,
} from '@/data/products'

import {
  getProductImage,
} from '@/data/images'

import {
  formatPKR,
} from '@/utils/currency'

import {
  trackEvent,
} from '@/services/tracking'

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  productIds?: string[]
}

/* =====================================================
   QUICK SUGGESTIONS
===================================================== */

const quickSuggestions = [
  `Find me headphones under ${formatPKR(300)}`,
  'Recommend a laptop for programming',
  'Compare iPhone 17 Pro and Galaxy S25 Ultra',
  'Where is my order?',
]

const greeting: Message = {
  id: 'greeting',
  role: 'ai',
  text:
    "Hello! I'm NOVA AI, your personal shopping assistant. I can help you find products, compare options, track orders, and recommend the best electronics for your needs. How can I help you today?",
}

export default function Chatbot() {
  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    messages,
    setMessages,
  ] = useState<Message[]>([
    greeting,
  ])

  const [
    input,
    setInput,
  ] = useState('')

  const [
    typing,
    setTyping,
  ] = useState(false)

  const messagesEndRef =
    useRef<HTMLDivElement>(null)

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [
    messages,
    typing,
  ])

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = (
    text: string,
  ) => {
    if (!text.trim()) {
      return
    }

    const userMessage: Message = {
      id:
        `u_${Date.now()}`,
      role:
        'user',
      text,
    }

    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ],
    )

    setInput('')
    setTyping(true)

    trackEvent(
      'chatbot_message',
      {
        message: text,
      },
    )

    window.setTimeout(
      () => {
        const response =
          generateMockResponse(
            text,
          )

        const aiMessage: Message = {
          id:
            `a_${Date.now()}`,
          role:
            'ai',
          text:
            response.text,
          productIds:
            response.productIds,
        }

        setMessages(
          (previous) => [
            ...previous,
            aiMessage,
          ],
        )

        setTyping(false)
      },
      1200,
    )
  }

  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <>

      {/* =================================================
          FLOATING BUTTON
      ================================================= */}

      <motion.button
        type="button"
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          delay: 1,
          duration: 0.5,
          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
        onClick={() => {
          setOpen(
            !open,
          )

          if (!open) {
            trackEvent(
              'chatbot_open',
              {},
            )
          }
        }}
        className="
          fixed
          bottom-6
          right-6
          z-[80]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-accent-400
          shadow-lg
          shadow-accent-500/20
          transition-all
          duration-500
          ease-premium
          hover:scale-105
          hover:bg-accent-300
        "
        aria-label={
          open
            ? 'Close AI Assistant'
            : 'Open AI Assistant'
        }
      >

        <AnimatePresence mode="wait">

          {open ? (

            <motion.div
              key="close"
              initial={{
                rotate: -90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: 90,
                opacity: 0,
              }}
            >

              <X className="h-6 w-6 text-ink-950" />

            </motion.div>

          ) : (

            <motion.div
              key="open"
              initial={{
                rotate: 90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: -90,
                opacity: 0,
              }}
            >

              <Sparkles className="h-6 w-6 text-ink-950" />

            </motion.div>

          )}

        </AnimatePresence>

        {!open && (

          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">

            <span className="absolute h-full w-full animate-ping rounded-full bg-accent-300 opacity-75" />

            <span className="relative h-3 w-3 rounded-full bg-accent-300" />

          </span>

        )}

      </motion.button>

      {/* =================================================
          CHAT PANEL
      ================================================= */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.35,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className="
              fixed
              bottom-24
              right-6
              z-[80]
              flex
              h-[560px]
              max-h-[calc(100vh-7rem)]
              w-[calc(100vw-3rem)]
              max-w-[400px]
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-ink-900/95
              backdrop-blur-2xl
            "
          >

            {/* =============================================
                HEADER
            ============================================= */}

            <div className="flex items-center justify-between border-b border-white/[0.06] p-4">

              <div className="flex items-center gap-3">

                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600">

                  <Bot className="h-5 w-5 text-ink-950" />

                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-green-400" />

                </div>

                <div>

                  <p className="font-display text-sm font-semibold text-white">
                    NOVA AI
                  </p>

                  <p className="text-xs text-green-400">
                    Online · Ready to help
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="text-white/40 transition-colors hover:text-white"
                aria-label="Close AI Assistant"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* =============================================
                MESSAGES
            ============================================= */}

            <div className="flex-1 space-y-4 overflow-y-auto p-4">

              {messages.map(
                (message) => (

                  <motion.div
                    key={
                      message.id
                    }
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className={`
                      flex
                      gap-2.5

                      ${
                        message.role ===
                        'user'
                          ? 'flex-row-reverse'
                          : ''
                      }
                    `}
                  >

                    {/* AVATAR */}

                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg

                        ${
                          message.role ===
                          'user'
                            ? 'bg-white/10'
                            : 'bg-accent-400/20'
                        }
                      `}
                    >

                      {message.role ===
                      'user' ? (

                        <UserIcon className="h-4 w-4 text-white/70" />

                      ) : (

                        <Bot className="h-4 w-4 text-accent-300" />

                      )}

                    </div>

                    {/* MESSAGE */}

                    <div
                      className={`
                        max-w-[80%]

                        ${
                          message.role ===
                          'user'
                            ? 'items-end'
                            : ''
                        }
                      `}
                    >

                      <div
                        className={`
                          rounded-2xl
                          px-3.5
                          py-2.5
                          text-sm

                          ${
                            message.role ===
                            'user'
                              ? 'bg-accent-400 text-ink-950'
                              : 'bg-white/[0.06] text-white/90'
                          }
                        `}
                      >
                        {
                          message.text
                        }
                      </div>

                      {/* =====================================
                          PRODUCT RECOMMENDATIONS
                      ===================================== */}

                      {message.productIds &&
                        message.productIds.length >
                          0 && (

                        <div className="mt-2 space-y-2">

                          {message.productIds.map(
                            (
                              productId,
                            ) => {

                              const product =
                                getProductById(
                                  productId,
                                )

                              if (!product) {
                                return null
                              }

                              const image =
                                getProductImage(
                                  product.id,
                                )

                              const price =
                                getMinPrice(
                                  product,
                                )

                              const hasVariants =
                                hasVariantPricing(
                                  product,
                                )

                              return (

                                <Link
                                  key={
                                    productId
                                  }
                                  to={`/product/${productId}`}
                                  onClick={() =>
                                    setOpen(
                                      false,
                                    )
                                  }
                                  className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-ink-800/60
                                    p-2.5
                                    transition-colors
                                    hover:border-accent-400/30
                                  "
                                >

                                  {/* IMAGE */}

                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">

                                    <img
                                      src={
                                        image.listing
                                      }
                                      alt={
                                        product.name
                                      }
                                      draggable={
                                        false
                                      }
                                      className="h-full w-full object-contain"
                                    />

                                  </div>

                                  {/* INFO */}

                                  <div className="min-w-0 flex-1">

                                    <p className="truncate text-xs font-medium text-white">
                                      {
                                        product.name
                                      }
                                    </p>

                                    <p className="text-xs text-white/40">
                                      {
                                        product.brand
                                      }
                                    </p>

                                  </div>

                                  {/* PKR PRICE */}

                                  <div className="shrink-0 text-right">

                                    {hasVariants && (

                                      <p className="text-[10px] text-white/30">
                                        From
                                      </p>

                                    )}

                                    <span className="text-xs font-semibold text-accent-300">
                                      {formatPKR(
                                        price,
                                      )}
                                    </span>

                                  </div>

                                </Link>

                              )

                            },
                          )}

                        </div>

                      )}

                    </div>

                  </motion.div>

                ),
              )}

              {/* =============================================
                  TYPING INDICATOR
              ============================================= */}

              {typing && (

                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="flex gap-2.5"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400/20">

                    <Bot className="h-4 w-4 text-accent-300" />

                  </div>

                  <div className="flex items-center gap-1 rounded-2xl bg-white/[0.06] px-4 py-3">

                    {[
                      0,
                      1,
                      2,
                    ].map(
                      (index) => (

                        <span
                          key={
                            index
                          }
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40"
                          style={{
                            animationDelay:
                              `${index * 0.15}s`,
                          }}
                        />

                      ),
                    )}

                  </div>

                </motion.div>

              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

            {/* =============================================
                QUICK SUGGESTIONS
            ============================================= */}

            {messages.length <=
              1 && (

              <div className="border-t border-white/[0.06] p-3">

                <p className="mb-2 flex items-center gap-1.5 text-xs text-white/40">

                  <TrendingUp className="h-3 w-3" />

                  Try asking

                </p>

                <div className="flex flex-wrap gap-2">

                  {quickSuggestions.map(
                    (
                      suggestion,
                    ) => (

                      <button
                        key={
                          suggestion
                        }
                        type="button"
                        onClick={() =>
                          sendMessage(
                            suggestion,
                          )
                        }
                        className="
                          rounded-full
                          border
                          border-white/[0.08]
                          px-3
                          py-1.5
                          text-xs
                          text-white/60
                          transition-colors
                          hover:border-accent-400/40
                          hover:text-accent-300
                        "
                      >
                        {
                          suggestion
                        }
                      </button>

                    ),
                  )}

                </div>

              </div>

            )}

            {/* =============================================
                INPUT
            ============================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="flex items-center gap-2 border-t border-white/[0.06] p-3"
            >

              <input
                value={
                  input
                }
                onChange={(
                  event,
                ) =>
                  setInput(
                    event.target.value,
                  )
                }
                placeholder="Ask me anything..."
                className="
                  flex-1
                  rounded-full
                  bg-white/[0.06]
                  px-4
                  py-2.5
                  text-sm
                  text-white
                  placeholder:text-white/30
                  focus:outline-none
                "
              />

              <button
                type="submit"
                disabled={
                  !input.trim()
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent-400
                  text-ink-950
                  transition-colors
                  hover:bg-accent-300
                  disabled:opacity-40
                "
                aria-label="Send message"
              >

                <Send className="h-4 w-4" />

              </button>

            </form>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  )
}