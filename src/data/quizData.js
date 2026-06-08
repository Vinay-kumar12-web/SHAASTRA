/**
 * quizData.js
 * Quiz questions per domain for the Topic Completion system.
 * Each quiz has 5-10 multiple choice questions.
 */

export const quizzes = {
  coding: {
    title: "Coding Fundamentals Quiz",
    questions: [
      {
        id: 1,
        question: "What does 'variable' mean in programming?",
        options: ["A fixed value that never changes", "A named storage location that holds data", "A type of loop", "A CSS property"],
        answer: 1,
        explanation: "A variable is a named container that stores data values which can change during program execution.",
      },
      {
        id: 2,
        question: "Which of the following is a Python data type?",
        options: ["varchar", "integer", "list", "array"],
        answer: 2,
        explanation: "Python has built-in types: int, float, str, list, tuple, dict, set, bool.",
      },
      {
        id: 3,
        question: "What is the output of: print(2 ** 3) in Python?",
        options: ["6", "8", "9", "23"],
        answer: 1,
        explanation: "The ** operator is used for exponentiation. 2 ** 3 = 2³ = 8.",
      },
      {
        id: 4,
        question: "What does a 'for loop' do?",
        options: ["Defines a function", "Iterates over a sequence of values", "Imports a module", "Creates a class"],
        answer: 1,
        explanation: "A for loop iterates over each item in a sequence (list, range, string, etc.) and executes a block of code for each item.",
      },
      {
        id: 5,
        question: "What does 'def' keyword do in Python?",
        options: ["Defines a variable", "Imports a library", "Defines a function", "Deletes a value"],
        answer: 2,
        explanation: "The 'def' keyword is used to define a function in Python. Example: def my_function():",
      },
      {
        id: 6,
        question: "Which data structure stores key-value pairs in Python?",
        options: ["list", "tuple", "set", "dictionary"],
        answer: 3,
        explanation: "A dictionary (dict) stores pairs of keys and values. Example: {'name': 'Alice', 'age': 25}",
      },
      {
        id: 7,
        question: "What does OOP stand for?",
        options: ["Object-Oriented Programming", "Online Operation Protocol", "Output Over Processing", "Object Overlay Pattern"],
        answer: 0,
        explanation: "OOP stands for Object-Oriented Programming — a paradigm that organizes code around objects and classes.",
      },
    ],
  },
  designing: {
    title: "Graphic Design Concepts Quiz",
    questions: [
      {
        id: 1,
        question: "What are the three primary colors in the RGB color model?",
        options: ["Red, Yellow, Blue", "Red, Green, Blue", "Cyan, Magenta, Yellow", "Orange, Purple, Green"],
        answer: 1,
        explanation: "The RGB model uses Red, Green, and Blue as primary colors — used in digital displays and screens.",
      },
      {
        id: 2,
        question: "What does 'kerning' refer to in typography?",
        options: ["The height of capital letters", "The spacing between individual character pairs", "The overall line spacing", "The font weight"],
        answer: 1,
        explanation: "Kerning refers to adjusting the space between specific pairs of characters to improve visual appearance.",
      },
      {
        id: 3,
        question: "A color that is opposite to another on the color wheel is called:",
        options: ["Analogous", "Triadic", "Complementary", "Monochromatic"],
        answer: 2,
        explanation: "Complementary colors sit 180° apart on the color wheel (e.g., blue and orange) — they create strong contrast.",
      },
      {
        id: 4,
        question: "Which file format is best for logos that need to scale to any size?",
        options: ["JPG", "PNG", "SVG", "GIF"],
        answer: 2,
        explanation: "SVG (Scalable Vector Graphics) is vector-based, meaning it scales to any size without losing quality.",
      },
      {
        id: 5,
        question: "Which design principle ensures elements are visually weighted and stable?",
        options: ["Emphasis", "Repetition", "Balance", "Proportion"],
        answer: 2,
        explanation: "Balance distributes visual weight across a composition — it can be symmetrical (formal) or asymmetrical (dynamic).",
      },
      {
        id: 6,
        question: "What is a 'mood board' used for in the design process?",
        options: ["Tracking bugs in the design", "Collecting visual inspiration and setting the aesthetic direction", "Writing user stories", "Testing the design with users"],
        answer: 1,
        explanation: "A mood board is a collage of images, colors, fonts, and textures that captures the visual direction of a project.",
      },
    ],
  },
  marketing: {
    title: "Digital Marketing Quiz",
    questions: [
      {
        id: 1,
        question: "What does SEO stand for?",
        options: ["Social Engagement Optimization", "Search Engine Optimization", "Site Efficiency Operations", "Sales Email Outreach"],
        answer: 1,
        explanation: "SEO = Search Engine Optimization — the practice of improving a website to rank higher in search engine results pages.",
      },
      {
        id: 2,
        question: "What is a 'conversion rate'?",
        options: ["The percentage of website visitors who complete a desired action", "The number of emails sent per campaign", "The cost per click on an ad", "The total ad impressions"],
        answer: 0,
        explanation: "Conversion rate = (Conversions / Total Visitors) × 100%. It measures how effectively a page turns visitors into customers.",
      },
      {
        id: 3,
        question: "What does CTA mean in marketing?",
        options: ["Click To Advertise", "Cost To Acquire", "Call To Action", "Content Targeting Algorithm"],
        answer: 2,
        explanation: "CTA = Call To Action — a prompt that tells the user what to do next (e.g., 'Buy Now', 'Sign Up', 'Learn More').",
      },
      {
        id: 4,
        question: "Which metric measures email marketing performance?",
        options: ["CTR", "Open Rate", "Bounce Rate", "All of the above"],
        answer: 3,
        explanation: "Email marketers track Open Rate (emails opened), CTR (links clicked), and Bounce Rate (undelivered emails).",
      },
      {
        id: 5,
        question: "What is A/B testing?",
        options: ["Testing two different websites", "Comparing two versions of content to see which performs better", "Running two ad campaigns simultaneously", "Testing on mobile vs. desktop"],
        answer: 1,
        explanation: "A/B testing compares two variants (A and B) of a piece of content to determine which drives better results.",
      },
    ],
  },
  "data-science": {
    title: "Data Science Fundamentals Quiz",
    questions: [
      {
        id: 1,
        question: "What does EDA stand for in data science?",
        options: ["External Data Access", "Exploratory Data Analysis", "Enhanced Data Algorithm", "Error Detection Analysis"],
        answer: 1,
        explanation: "EDA (Exploratory Data Analysis) is the process of analyzing data to summarize its main characteristics before modeling.",
      },
      {
        id: 2,
        question: "Which Python library is primarily used for data manipulation?",
        options: ["NumPy", "Matplotlib", "Pandas", "TensorFlow"],
        answer: 2,
        explanation: "Pandas provides DataFrame structures and powerful tools for data manipulation, cleaning, and analysis.",
      },
      {
        id: 3,
        question: "What is the 'mean' of a dataset?",
        options: ["The middle value when sorted", "The most frequent value", "The sum of all values divided by count", "The range between max and min"],
        answer: 2,
        explanation: "Mean = sum of all values / number of values. It's the arithmetic average of a dataset.",
      },
      {
        id: 4,
        question: "What is a null value in data?",
        options: ["A value of zero", "A missing or undefined value", "A negative number", "An infinite value"],
        answer: 1,
        explanation: "Null values (NaN, None) represent missing data. Handling them by dropping or imputing is a key data cleaning step.",
      },
      {
        id: 5,
        question: "Which visualization is best for showing distribution of a single variable?",
        options: ["Line chart", "Scatter plot", "Histogram", "Pie chart"],
        answer: 2,
        explanation: "A histogram shows the distribution (frequency) of values in a single numerical variable using bins.",
      },
    ],
  },
  "ai-ml": {
    title: "AI & Machine Learning Quiz",
    questions: [
      {
        id: 1,
        question: "What is supervised learning?",
        options: ["Learning without labeled data", "Learning from labeled input-output pairs", "Learning through reinforcement", "Learning by clustering data"],
        answer: 1,
        explanation: "Supervised learning trains models on labeled datasets (input-output pairs) to predict outputs for new inputs.",
      },
      {
        id: 2,
        question: "What is 'overfitting' in machine learning?",
        options: ["Model performs well on training data but poorly on new data", "Model that is too simple", "Training for too many epochs", "Using too little data"],
        answer: 0,
        explanation: "Overfitting happens when a model memorizes training data rather than learning patterns, failing to generalize.",
      },
      {
        id: 3,
        question: "Which algorithm is commonly used for binary classification?",
        options: ["K-Means Clustering", "Logistic Regression", "PCA", "DBSCAN"],
        answer: 1,
        explanation: "Logistic Regression is a classic algorithm for binary classification, outputting probabilities between 0 and 1.",
      },
      {
        id: 4,
        question: "What does 'training' a model mean?",
        options: ["Saving the model to a file", "Adjusting model parameters to minimize error on training data", "Collecting data", "Testing model accuracy"],
        answer: 1,
        explanation: "Training adjusts model weights/parameters through optimization (e.g., gradient descent) to minimize a loss function.",
      },
      {
        id: 5,
        question: "What is a neural network roughly modeled after?",
        options: ["Computer circuits", "Biological neurons in the brain", "Database tables", "File systems"],
        answer: 1,
        explanation: "Neural networks are loosely inspired by biological neurons — layers of connected nodes that process and transmit signals.",
      },
    ],
  },
  freelancing: {
    title: "Freelancing Mastery Quiz",
    questions: [
      {
        id: 1,
        question: "What is the biggest advantage of project-based pricing over hourly pricing?",
        options: ["It's easier to track", "You get paid for value rather than time", "Clients always prefer it", "It requires less skill"],
        answer: 1,
        explanation: "Project-based pricing allows you to earn more as you become more efficient, decoupling your income from your hours worked.",
      },
      {
        id: 2,
        question: "What should be the main focus of a freelance proposal?",
        options: ["Your life story", "Your education", "Solving the client's problem", "Your lowest price"],
        answer: 2,
        explanation: "A winning proposal focuses on the client's needs and how your specific skills will solve their problem.",
      },
      {
        id: 3,
        question: "What is 'scope creep'?",
        options: ["Increasing your hourly rate", "The gradual expansion of a project beyond its original boundaries", "Slow delivery of work", "Finding new clients"],
        answer: 1,
        explanation: "Scope creep happens when a project's requirements grow without a corresponding increase in budget or timeline.",
      },
    ],
  },
  trading: {
    title: "Market Trading Quiz",
    questions: [
      {
        id: 1,
        question: "What is a 'Stop Loss' order?",
        options: ["An order to buy at a lower price", "An order to close a trade to limit potential losses", "A way to double your profit", "An order to buy more when price drops"],
        answer: 1,
        explanation: "A Stop Loss is a critical risk management tool that automatically exits a trade when it hits a certain loss threshold.",
      },
      {
        id: 2,
        question: "In technical analysis, what is 'Support'?",
        options: ["A price level where a downtrend tends to pause", "The company's customer service", "A price level where an uptrend pauses", "The amount of money in your account"],
        answer: 0,
        explanation: "Support is a price level where buying interest is strong enough to overcome selling pressure, preventing further price drops.",
      },
      {
        id: 3,
        question: "What does a 'Golden Cross' indicate?",
        options: ["Market crash", "Bearish trend", "Bullish signal where short-term MA crosses above long-term MA", "Neutral market"],
        answer: 2,
        explanation: "A Golden Cross (e.g., 50-day crossing above 200-day MA) is widely considered a long-term bullish signal.",
      },
    ],
  },
  "content-creation": {
    title: "Content Strategy Quiz",
    questions: [
      {
        id: 1,
        question: "What is a 'Hook' in content creation?",
        options: ["The end of a video", "A link in the description", "The first few seconds designed to grab attention", "A physical tool for filming"],
        answer: 2,
        explanation: "The hook is the most critical part of content, designed to stop the scroll and convince the viewer to keep watching/reading.",
      },
      {
        id: 2,
        question: "What does 'Niche' mean?",
        options: ["A very expensive camera", "A specific, focused segment of the market", "Posting every day", "The amount of followers you have"],
        answer: 1,
        explanation: "A niche defines your specialty and the specific audience you are targeting (e.g., 'Python for Accountants' vs just 'Coding').",
      },
      {
        id: 3,
        question: "What is 'user-generated content' (UGC)?",
        options: ["Content made by the creator", "Ads made by agencies", "Content created by customers or fans", "Auto-generated AI content"],
        answer: 2,
        explanation: "UGC is powerful social proof where your community creates content about your brand or product.",
      },
    ],
  },
  uiux: {
    title: "UI/UX Design Quiz",
    questions: [
      {
        id: 1,
        question: "What is the primary difference between UI and UX?",
        options: ["They are exactly the same", "UI is how it looks; UX is how it works", "UI is for mobile; UX is for desktop", "UX is only for researchers"],
        answer: 1,
        explanation: "UI (User Interface) focuses on visual design elements, while UX (User Experience) focuses on the overall feel and journey of the user.",
      },
      {
        id: 2,
        question: "What is 'Information Architecture' (IA)?",
        options: ["The code used to build an app", "The structural design of shared information environments", "Designing icons", "Building servers"],
        answer: 1,
        explanation: "IA is the organization and labeling of content to help users find information and complete tasks efficiently.",
      },
      {
        id: 3,
        question: "What is a 'Wireframe'?",
        options: ["A finished design", "A high-fidelity prototype", "A low-fidelity visual guide of a website structure", "A 3D model"],
        answer: 2,
        explanation: "Wireframes are skeletal blueprints of a design, focusing on layout and functionality before adding visual details like color.",
      },
    ],
  },
  cybersecurity: {
    title: "Cybersecurity Defense Quiz",
    questions: [
      {
        id: 1,
        question: "What does the 'A' in the CIA Triad stand for?",
        options: ["Authentication", "Availability", "Authorization", "Accounting"],
        answer: 1,
        explanation: "The CIA Triad stands for Confidentiality, Integrity, and Availability.",
      },
      {
        id: 2,
        question: "A spear-phishing attack is characterized by:",
        options: ["Sending mass emails to millions", "Targeting a specific individual or organization", "Using physical lockpicks", "DDoS attacks"],
        answer: 1,
        explanation: "Spear-phishing is a targeted attempt to steal sensitive information from a specific person or group.",
      },
      {
        id: 3,
        question: "Which port is commonly used for secure SSH connections?",
        options: ["80", "443", "22", "21"],
        answer: 2,
        explanation: "Port 22 is the default port for SSH (Secure Shell).",
      },
      {
        id: 4,
        question: "What is the primary purpose of a firewall?",
        options: ["To speed up internet", "To monitor and control incoming/outgoing traffic", "To back up data", "To encrypt emails"],
        answer: 1,
        explanation: "A firewall acts as a barrier between trusted and untrusted networks, controlling traffic based on rules.",
      },
    ],
  },
};

export const getQuizByDomain = (domainId) =>
  quizzes[domainId] || quizzes["coding"]; // Default to coding quiz
