import { Transaction, Budget, Subscription } from './types'
import { uuid } from './utils'

const CATEGORIES = [
  'Housing', 
  'Food', 
  'Transport', 
  'Shopping', 
  'Health', 
  'Gaming', 
  'Entertainment', 
  'Utilities',
  'Education',
  'Income',
  'Investments',
  'Subscriptions'
]

const DESCRIPTIONS: Record<string, string[]> = {
  'Housing': ['Monthly Rent', 'Home Insurance', 'Mortgage Payment', 'IKEA Furniture', 'Home Depot Repair', 'Gardening Service'],
  'Food': ['Biedronka', 'Lidl', 'Uber Eats', 'Starbucks', 'McDonald\'s', 'Local Restaurant', 'Bakery', 'Whole Foods', 'Wolt Delivery'],
  'Transport': ['Shell Gas Station', 'Uber Ride', 'Bolt', 'Public Transport Pass', 'Car Wash', 'Parking Fee', 'Train Ticket'],
  'Shopping': ['Amazon.com', 'Zalando', 'H&M', 'Nike', 'Apple Store', 'Best Buy', 'Electronic Gadget', 'Pharmacy Purchase'],
  'Health': ['Pharmacy', 'City Hospital', 'Gym Membership', 'Yoga Class', 'Supplements Store', 'Dental Checkup'],
  'Gaming': ['Steam Games', 'PlayStation Store', 'Epic Games Store', 'Nintendo eShop', 'Discord Nitro'],
  'Entertainment': ['Netflix', 'Spotify', 'Disney+', 'HBO Max', 'Cinema City', 'Concert Tickets', 'Museum', 'Kindle Books'],
  'Utilities': ['Electric Bill', 'Water Bill', 'Internet (Fiber)', 'Mobile Phone Plan', 'Trash Collection'],
  'Education': ['Udemy Course', 'Coursera Subscription', 'Textbooks', 'Language School', 'Conference Pass'],
  'Investments': ['Stock Purchase', 'Crypto Deposit', 'Vanguard ETF', 'Savings Deposit'],
  'Income': ['Monthly Salary', 'Freelance Project', 'Dividend Payout', 'Etsy Sale', 'Tax Refund'],
  'Subscriptions': ['Netflix Premium', 'Spotify Family', 'ChatGPT Plus', 'YouTube Premium', 'Amazon Prime', 'Adobe Creative Cloud', 'GitHub Pro', 'Canva Subscription', 'Midjourney AI']
}

export const generateSeedData = (): { transactions: Transaction[], budgets: Budget[], subscriptions: Subscription[] } => {
  const transactions: Transaction[] = []
  const budgets: Budget[] = []
  const subscriptions: Subscription[] = []
  const now = new Date()
  
  // Generate Subscriptions
  const subConfigs = [
    { name: 'Netflix', cost: 15.99, category: 'Entertainment' },
    { name: 'Spotify', cost: 9.99, category: 'Entertainment' },
    { name: 'ChatGPT Plus', cost: 20.00, category: 'Subscriptions' },
    { name: 'Gym Membership', cost: 45.00, category: 'Health' },
    { name: 'GitHub Pro', cost: 4.00, category: 'Subscriptions' }
  ]

  subConfigs.forEach(config => {
    subscriptions.push({
      id: uuid(),
      name: config.name,
      cost: config.cost,
      category: config.category,
      billingCycle: 'monthly',
      isFixed: true,
      nextBillingDate: new Date(now.getFullYear(), now.getMonth(), 15).toISOString().split('T')[0]
    })
  })

  // Last 6 months of data
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = monthDate.toISOString().slice(0, 7)

    // Add Budgets for each month
    budgets.push(
      { id: uuid(), category: 'Food', limit: 800, month: monthStr },
      { id: uuid(), category: 'Shopping', limit: 500, month: monthStr },
      { id: uuid(), category: 'Transport', limit: 200, month: monthStr },
      { id: uuid(), category: 'Entertainment', limit: 300, month: monthStr }
    )
  }

  // Ensure current month has a very high expense in Food to trigger alert
  const currentMonthStr = now.toISOString().slice(0, 7)
  const currentMonthDateStr = now.toISOString().split('T')[0]
  
  transactions.push({
    id: uuid(),
    type: 'expense',
    amount: 850.50, // Exceeds 800 budget
    description: 'Big Party Food',
    category: 'Food',
    date: currentMonthDateStr,
    createdAt: now.getTime()
  })

  // Ensure one subscription is due in 3 days
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(now.getDate() + 3)
  
  subscriptions.push({
    id: uuid(),
    name: 'iCloud+',
    cost: 0.99,
    category: 'Subscriptions',
    billingCycle: 'monthly',
    isFixed: true,
    nextBillingDate: threeDaysFromNow.toISOString().split('T')[0]
  })

  for (let i = 0; i < 180; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Monthly Salary
    if (date.getDate() === 1) {
       transactions.push({
         id: uuid(),
         type: 'income',
         amount: 6500 + Math.random() * 1000,
         description: 'Monthly Salary',
         category: 'Income',
         date: dateStr,
         createdAt: date.getTime()
       })
    }

    // Mid-month Bonus/Freelance
    if (date.getDate() === 15 && Math.random() > 0.5) {
       transactions.push({
         id: uuid(),
         type: 'income',
         amount: 1200 + Math.random() * 800,
         description: 'Freelance Project Payout',
         category: 'Income',
         date: dateStr,
         createdAt: date.getTime() + 1
       })
    }
    
    // Rent
    if (date.getDate() === 3) {
       transactions.push({
         id: uuid(),
         type: 'expense',
         amount: 1850,
         description: 'Apartment Rent',
         category: 'Housing',
         date: dateStr,
         createdAt: date.getTime()
       })
    }

    // Utilities
    if (date.getDate() === 7) {
       transactions.push({
         id: uuid(),
         type: 'expense',
         amount: 180 + Math.random() * 50,
         description: 'Electricity & Water',
         category: 'Utilities',
         date: dateStr,
         createdAt: date.getTime()
       })
    }

    // Subscriptions (staggered)
    const subs = [
      { name: 'Netflix', day: 5, cost: 15.99 },
      { name: 'Spotify', day: 10, cost: 9.99 },
      { name: 'GitHub Pro', day: 12, cost: 4.00 },
      { name: 'ChatGPT Plus', day: 20, cost: 20.00 },
      { name: 'Amazon Prime', day: 25, cost: 14.99 }
    ]

    subs.forEach(sub => {
      if (date.getDate() === sub.day) {
        transactions.push({
          id: uuid(),
          type: 'expense',
          amount: sub.cost,
          description: sub.name,
          category: 'Subscriptions',
          date: dateStr,
          createdAt: date.getTime() + 2
        })
      }
    })
    
    // Random daily expenses
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const dailyCount = Math.floor(Math.random() * (isWeekend ? 6 : 4))
    
    for (let j = 0; j < dailyCount; j++) {
      const category = CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1))]
      if (category === 'Income') continue

      const descriptions = DESCRIPTIONS[category] || ['Misc Expense']
      const description = descriptions[Math.floor(Math.random() * descriptions.length)]
      
      let amount = 0
      if (category === 'Food') amount = 15 + Math.random() * 80
      else if (category === 'Shopping') amount = 30 + Math.random() * 300
      else if (category === 'Transport') amount = 5 + Math.random() * 60
      else if (category === 'Entertainment') amount = 20 + Math.random() * 150
      else amount = 10 + Math.random() * 100
        
      transactions.push({
        id: uuid(),
        type: 'expense',
        amount: Math.round(amount * 100) / 100,
        description,
        category,
        date: dateStr,
        createdAt: date.getTime() + 100 + j
      })
    }
  }
  
  return {
    transactions: transactions.sort((a, b) => b.createdAt - a.createdAt),
    budgets,
    subscriptions
  }
}

