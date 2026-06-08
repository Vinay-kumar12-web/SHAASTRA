import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * studyPlanAI.js
 * AI study plan generation engine.
 * Simulates an AI response for study plan creation and scheduling.
 * In production, replace with a real API call to OpenAI, Gemini, or similar.
 */

/**
 * Parses a user message to determine intent.
 * Returns: 'create_plan' | 'convert_schedule' | 'general'
 */
function detectIntent(message) {
  const lower = message.toLowerCase();
  if (
    lower.includes("create") ||
    lower.includes("make") ||
    lower.includes("generate") ||
    lower.includes("plan for") ||
    lower.includes("learn") ||
    lower.includes("study plan")
  )
    return "create_plan";
  if (
    lower.includes("convert") ||
    lower.includes("schedule") ||
    lower.includes("organize") ||
    lower.includes("breakdown") ||
    lower.includes("my plan") ||
    lower.includes("existing plan")
  )
    return "convert_schedule";
  if (lower.includes("pin") || lower.includes("save to manager") || lower.includes("add to manager"))
    return "pin_request";
  return "general";
}

/**
 * Extracts subject and duration from user message.
 * Example: "learn Python in 30 days" → { subject: "Python", days: 30 }
 */
function extractPlanDetails(message) {
  const lower = message.toLowerCase();

  // Extract subject
  const subjectPatterns = [
    /learn(?:ing)?\s+([a-z\s&+#]+?)(?:\s+in|\s+for|\s+over|$)/i,
    /study plan for\s+([a-z\s&+#]+?)(?:\s+in|\s+for|\s+over|$)/i,
    /plan for\s+([a-z\s&+#]+?)(?:\s+in|\s+for|\s+over|$)/i,
    /mastering?\s+([a-z\s&+#]+?)(?:\s+in|\s+for|\s+over|$)/i,
  ];

  let subject = "Programming";
  for (const pattern of subjectPatterns) {
    const match = message.match(pattern);
    if (match) {
      subject = match[1].trim();
      // Capitalize first letter of each word
      subject = subject.replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    }
  }

  // Extract duration
  const daysMatch = lower.match(/(\d+)\s*(?:days?|day)/);
  const weeksMatch = lower.match(/(\d+)\s*(?:weeks?|week)/);
  const monthsMatch = lower.match(/(\d+)\s*(?:months?|month)/);

  let days = 30; // default
  if (daysMatch) days = parseInt(daysMatch[1]);
  else if (weeksMatch) days = parseInt(weeksMatch[1]) * 7;
  else if (monthsMatch) days = parseInt(monthsMatch[1]) * 30;

  return { subject, days };
}


// ─── Topic sequences per subject ─────────────────────────────────────────────
const TOPIC_DB = {
  python: [
    { name: "Variables & Data Types",    doc: ["Python Intro", "https://docs.python.org/3/tutorial/introduction.html"],   vid: ["FreeCodeCamp Python Full Course", "https://www.youtube.com/watch?v=rfscVS0vtbw"] },
    { name: "Strings & String Methods",  doc: ["Python Strings", "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str"], vid: ["Corey Schafer – Strings", "https://www.youtube.com/watch?v=k9TUPpGqYTo"] },
    { name: "Numbers & Math Operations", doc: ["Python Numbers", "https://docs.python.org/3/tutorial/introduction.html#numbers"], vid: ["Python Math – Socratica", "https://www.youtube.com/watch?v=PP-gEKgKTVM"] },
    { name: "User Input & Type Casting", doc: ["input() Docs", "https://docs.python.org/3/library/functions.html#input"],   vid: ["Python Input – CS Dojo", "https://www.youtube.com/watch?v=9Kzn2pM5RkA"] },
    { name: "if / elif / else",          doc: ["Control Flow", "https://docs.python.org/3/tutorial/controlflow.html"],       vid: ["Corey Schafer – Conditionals", "https://www.youtube.com/watch?v=DZwmZ8Usvnk"] },
    { name: "for Loops & range()",       doc: ["Python for Loops", "https://docs.python.org/3/tutorial/controlflow.html#for-statements"], vid: ["for Loop Tutorial", "https://www.youtube.com/watch?v=94UHCEmprCY"] },
    { name: "while Loops",               doc: ["while Loops", "https://docs.python.org/3/reference/compound_stmts.html#while"], vid: ["While Loop – Corey Schafer", "https://www.youtube.com/watch?v=6iF8Xb7Z3wQ"] },
    { name: "Functions & Parameters",    doc: ["Defining Functions", "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"], vid: ["Python Functions – Corey Schafer", "https://www.youtube.com/watch?v=9Os0o3wzS_I"] },
    { name: "Lists & List Methods",      doc: ["Python Lists", "https://docs.python.org/3/tutorial/datastructures.html"],   vid: ["Lists Tutorial – Corey Schafer", "https://www.youtube.com/watch?v=W8KRzm-HUcc"] },
    { name: "Tuples & Sets",             doc: ["Tuples & Sets", "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences"], vid: ["Tuples vs Lists", "https://www.youtube.com/watch?v=4bpNTGpFgmg"] },
    { name: "Dictionaries",              doc: ["Python Dicts", "https://docs.python.org/3/tutorial/datastructures.html#dictionaries"], vid: ["Dictionaries – Corey Schafer", "https://www.youtube.com/watch?v=daefaLgNkw0"] },
    { name: "List Comprehensions",       doc: ["List Comprehensions", "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions"], vid: ["List Comprehensions", "https://www.youtube.com/watch?v=3dt4OGnU5sM"] },
    { name: "File I/O: Read & Write",    doc: ["File Handling", "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files"], vid: ["File I/O – Corey Schafer", "https://www.youtube.com/watch?v=Uh2ebFW8OYM"] },
    { name: "Exception Handling",        doc: ["Exceptions", "https://docs.python.org/3/tutorial/errors.html"],             vid: ["Try/Except – Corey Schafer", "https://www.youtube.com/watch?v=NIWwJbo-9_8"] },
    { name: "Modules & Imports",         doc: ["Modules", "https://docs.python.org/3/tutorial/modules.html"],               vid: ["Python Modules", "https://www.youtube.com/watch?v=CqvZ3vGoGs0"] },
    { name: "Classes & OOP Basics",      doc: ["Python Classes", "https://docs.python.org/3/tutorial/classes.html"],        vid: ["OOP Corey Schafer Part 1", "https://www.youtube.com/watch?v=ZDa-Z5JzLYM"] },
    { name: "Inheritance",               doc: ["Inheritance", "https://docs.python.org/3/tutorial/classes.html#inheritance"], vid: ["OOP Inheritance", "https://www.youtube.com/watch?v=RSl87lqOXDE"] },
    { name: "Working with APIs",         doc: ["Requests Docs", "https://docs.python-requests.org/"],                       vid: ["Python APIs – Corey Schafer", "https://www.youtube.com/watch?v=tb8gHvYlCFs"] },
    { name: "JSON Parsing",              doc: ["JSON Docs", "https://docs.python.org/3/library/json.html"],                 vid: ["JSON in Python", "https://www.youtube.com/watch?v=9N6a-VLBa2I"] },
    { name: "Virtual Environments",      doc: ["venv Docs", "https://docs.python.org/3/library/venv.html"],                 vid: ["Python venv", "https://www.youtube.com/watch?v=APOPm01BVrk"] },
  ],
  javascript: [
    { name: "Variables: var, let, const", doc: ["MDN Variables", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables"], vid: ["JS Variables – Fireship", "https://www.youtube.com/watch?v=5o9c-EU2M0"] },
    { name: "Data Types & Type Coercion", doc: ["MDN Data Types", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures"], vid: ["JS Data Types", "https://www.youtube.com/watch?v=-d8pIBVDPSE"] },
    { name: "Functions & Arrow Functions", doc: ["MDN Functions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"], vid: ["JS Functions – The Coding Train", "https://www.youtube.com/watch?v=wRHAitGzj8I"] },
    { name: "Arrays & Array Methods",    doc: ["MDN Arrays", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"], vid: ["Array Methods – Web Dev Simplified", "https://www.youtube.com/watch?v=R8rmfD9Y5-c"] },
    { name: "Objects & Destructuring",   doc: ["MDN Objects", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics"], vid: ["Objects in JS", "https://www.youtube.com/watch?v=PFmuCDHHpwk"] },
    { name: "DOM Selection & Manipulation", doc: ["MDN DOM", "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"], vid: ["DOM Manipulation – Traversy", "https://www.youtube.com/watch?v=0ik6X4DJKCc"] },
    { name: "Event Listeners",           doc: ["MDN Events", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events"], vid: ["JS Events – Web Dev Simplified", "https://www.youtube.com/watch?v=XF1_MlZ5l6M"] },
    { name: "Promises & Async/Await",    doc: ["MDN Promises", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"], vid: ["Async JS – Fireship", "https://www.youtube.com/watch?v=vn3tm0quoqE"] },
    { name: "fetch() API Calls",         doc: ["MDN fetch", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"],             vid: ["Fetch API – Traversy", "https://www.youtube.com/watch?v=Oive66jrwBs"] },
    { name: "LocalStorage & SessionStorage", doc: ["MDN Storage", "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"],            vid: ["LocalStorage Tutorial", "https://www.youtube.com/watch?v=k8yJCeuP6I8"] },
    { name: "ES6 Modules (import/export)", doc: ["MDN Modules", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"],         vid: ["ES6 Modules Explained", "https://www.youtube.com/watch?v=cRHQNNkYi58"] },
    { name: "Classes & Prototypes",      doc: ["MDN Classes", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes"],        vid: ["JS Classes", "https://www.youtube.com/watch?v=2ZphE5HcQPQ"] },
    { name: "Error Handling: try/catch", doc: ["MDN try/catch", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch"], vid: ["Error Handling JS", "https://www.youtube.com/watch?v=blBoIyNhGvY"] },
    { name: "Map, Filter, Reduce",       doc: ["MDN Array Methods", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map"], vid: ["Map/Filter/Reduce", "https://www.youtube.com/watch?v=rRgD1yVwIvE"] },
    { name: "Regular Expressions (Regex)", doc: ["MDN Regex", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"], vid: ["Regex Crash Course", "https://www.youtube.com/watch?v=ZfQFUJhPqMM"] },
  ],
  "machine learning": [
    { name: "NumPy Arrays & Operations",     doc: ["NumPy Docs", "https://numpy.org/doc/stable/"],                       vid: ["NumPy Full Course – FreeCodeCamp", "https://www.youtube.com/watch?v=QUT1VHiLmmI"] },
    { name: "Pandas DataFrames",             doc: ["Pandas Docs", "https://pandas.pydata.org/docs/"],                    vid: ["Pandas Tutorial – Corey Schafer", "https://www.youtube.com/watch?v=ZyhVh-qRZPA"] },
    { name: "Data Cleaning & Preprocessing", doc: ["Kaggle Data Cleaning", "https://www.kaggle.com/learn/data-cleaning"], vid: ["Data Cleaning – Ken Jee", "https://www.youtube.com/watch?v=6MWaDPMpDM4"] },
    { name: "Exploratory Data Analysis",     doc: ["EDA Guide", "https://www.kaggle.com/learn/pandas"],                 vid: ["EDA in Python", "https://www.youtube.com/watch?v=xi0vhXFPegw"] },
    { name: "Data Visualization: Matplotlib", doc: ["Matplotlib Docs", "https://matplotlib.org/stable/tutorials/"], vid: ["Matplotlib Tutorial", "https://www.youtube.com/watch?v=3Xc3CA655Y4"] },
    { name: "Seaborn for Statistics",        doc: ["Seaborn Docs", "https://seaborn.pydata.org/"],                       vid: ["Seaborn Tutorial", "https://www.youtube.com/watch?v=6GUZXDef2U0"] },
    { name: "Linear Regression",             doc: ["Scikit-learn Linear Reg", "https://scikit-learn.org/stable/modules/linear_model.html"], vid: ["Linear Regression – StatQuest", "https://www.youtube.com/watch?v=nk2CQITm_eo"] },
    { name: "Logistic Regression",           doc: ["Scikit-learn Logistic", "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression"], vid: ["Logistic Regression – StatQuest", "https://www.youtube.com/watch?v=yIYKR4sgzI8"] },
    { name: "Decision Trees",                doc: ["Decision Trees", "https://scikit-learn.org/stable/modules/tree.html"], vid: ["Decision Trees – StatQuest", "https://www.youtube.com/watch?v=7VeUPuFGJHk"] },
    { name: "Random Forests",                doc: ["Random Forests Docs", "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees"], vid: ["Random Forest – StatQuest", "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ"] },
    { name: "Model Evaluation Metrics",      doc: ["Sklearn Metrics", "https://scikit-learn.org/stable/modules/model_evaluation.html"], vid: ["ML Evaluation Metrics", "https://www.youtube.com/watch?v=LbX4X71-TFI"] },
    { name: "Cross-Validation & Overfitting", doc: ["Cross Validation", "https://scikit-learn.org/stable/modules/cross_validation.html"], vid: ["Bias vs Variance", "https://www.youtube.com/watch?v=EuBBz3bI-aA"] },
    { name: "K-Means Clustering",            doc: ["K-Means Docs", "https://scikit-learn.org/stable/modules/clustering.html#k-means"], vid: ["K-Means Clustering", "https://www.youtube.com/watch?v=4b5d3muPQmA"] },
    { name: "Neural Networks Basics",        doc: ["Keras Guide", "https://keras.io/guides/"],                           vid: ["Neural Networks – 3Blue1Brown", "https://www.youtube.com/watch?v=aircAruvnKk"] },
    { name: "Deploying ML Models",           doc: ["Streamlit Docs", "https://docs.streamlit.io/"],                      vid: ["Model Deployment – Krish Naik", "https://www.youtube.com/watch?v=WNuzmkGahrY"] },
  ],
  java: [
    { name: "JDK Setup & Hello World",    doc: ["Java Docs", "https://docs.oracle.com/javase/tutorial/"],               vid: ["Java Full Course – FreeCodeCamp", "https://www.youtube.com/watch?v=grEKMHGYyns"] },
    { name: "Data Types & Variables",     doc: ["Java Types", "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html"], vid: ["Java Variables", "https://www.youtube.com/watch?v=4L3-DW-z7to"] },
    { name: "Control Flow: if/switch",    doc: ["Java Control Flow", "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html"], vid: ["Java Conditionals", "https://www.youtube.com/watch?v=2GPJbBhM8c0"] },
    { name: "Loops: for / while / do-while", doc: ["Java Loops", "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html"], vid: ["Java Loops", "https://www.youtube.com/watch?v=RzgPBFFoB7Q"] },
    { name: "Methods & Recursion",        doc: ["Java Methods", "https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html"], vid: ["Java Methods", "https://www.youtube.com/watch?v=_vAjcMJFZOo"] },
    { name: "Arrays & ArrayLists",        doc: ["Java Arrays", "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html"], vid: ["Arrays in Java", "https://www.youtube.com/watch?v=L06uGnF4IpY"] },
    { name: "Classes & Objects",          doc: ["Java OOP", "https://docs.oracle.com/javase/tutorial/java/concepts/"], vid: ["Java Classes – Bro Code", "https://www.youtube.com/watch?v=IUqKuGNasdM"] },
    { name: "Inheritance & Polymorphism", doc: ["Java Inheritance", "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html"], vid: ["Java Inheritance", "https://www.youtube.com/watch?v=9YOx3h3pv5Y"] },
    { name: "Interfaces & Abstract Classes", doc: ["Java Interfaces", "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html"], vid: ["Interfaces vs Abstract", "https://www.youtube.com/watch?v=HvPlEJ3LHgE"] },
    { name: "Exception Handling",         doc: ["Java Exceptions", "https://docs.oracle.com/javase/tutorial/essential/exceptions/"], vid: ["Java Exceptions", "https://www.youtube.com/watch?v=1XAfapkBQjk"] },
    { name: "Collections: HashMap & HashSet", doc: ["Java Collections", "https://docs.oracle.com/javase/tutorial/collections/"], vid: ["Java Collections", "https://www.youtube.com/watch?v=viTHc_4XfCA"] },
    { name: "Java Streams API",           doc: ["Streams Docs", "https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html"], vid: ["Java Streams", "https://www.youtube.com/watch?v=Q93o2qkPinQ"] },
    { name: "File I/O",                   doc: ["Java IO", "https://docs.oracle.com/javase/tutorial/essential/io/"], vid: ["Java File Handling", "https://www.youtube.com/watch?v=ScUJx4aWRi0"] },
    { name: "Spring Boot Intro",          doc: ["Spring Guides", "https://spring.io/guides"],                           vid: ["Spring Boot Tutorial", "https://www.youtube.com/watch?v=9SGDpanrc8U"] },
    { name: "REST API with Spring Boot",  doc: ["Spring REST", "https://spring.io/guides/gs/rest-service/"],            vid: ["Spring Boot REST API", "https://www.youtube.com/watch?v=5k1gfAKONAM"] },
  ],
  "data structures": [
    { name: "Arrays & Time Complexity",   doc: ["Big O Cheatsheet", "https://www.bigocheatsheet.com/"],                 vid: ["Array Data Structure", "https://www.youtube.com/watch?v=QJNwK2uJyGs"] },
    { name: "Linked Lists",               doc: ["Linked List – GeeksForGeeks", "https://www.geeksforgeeks.org/data-structures/linked-list/"], vid: ["Linked List – CS Dojo", "https://www.youtube.com/watch?v=WwfhLC16bis"] },
    { name: "Doubly Linked Lists",        doc: ["Doubly Linked List", "https://www.geeksforgeeks.org/doubly-linked-list/"], vid: ["Doubly Linked List", "https://www.youtube.com/watch?v=k0pjD12bzP0"] },
    { name: "Stacks",                     doc: ["Stack Data Structure", "https://www.geeksforgeeks.org/stack-data-structure/"], vid: ["Stack Explained", "https://www.youtube.com/watch?v=F1F2imiOJfk"] },
    { name: "Queues & Deques",            doc: ["Queue DS", "https://www.geeksforgeeks.org/queue-data-structure/"],      vid: ["Queue Data Structure", "https://www.youtube.com/watch?v=XuCbpw6Bj1U"] },
    { name: "Hash Maps & Hash Tables",    doc: ["Hash Table – GFG", "https://www.geeksforgeeks.org/hashing-data-structure/"], vid: ["Hash Tables – CS Dojo", "https://www.youtube.com/watch?v=shs0KM3wKv8"] },
    { name: "Binary Trees",               doc: ["Binary Tree – GFG", "https://www.geeksforgeeks.org/binary-tree-data-structure/"], vid: ["Binary Trees", "https://www.youtube.com/watch?v=oSWTXtMglKE"] },
    { name: "Binary Search Trees",        doc: ["BST – GFG", "https://www.geeksforgeeks.org/binary-search-tree-data-structure/"], vid: ["BST Explained", "https://www.youtube.com/watch?v=pYT9F8_LFTM"] },
    { name: "Tree Traversals (DFS/BFS)",  doc: ["Tree Traversal", "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/"], vid: ["Tree Traversal", "https://www.youtube.com/watch?v=1WxLM2hwL-U"] },
    { name: "Heaps & Priority Queues",    doc: ["Heap DS", "https://www.geeksforgeeks.org/heap-data-structure/"],        vid: ["Heap Explained", "https://www.youtube.com/watch?v=t0Cq6tVNRBA"] },
    { name: "Graphs: Representation",     doc: ["Graph DS", "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"], vid: ["Graph Intro", "https://www.youtube.com/watch?v=gXgEDyodOJU"] },
    { name: "BFS Algorithm",              doc: ["BFS – GFG", "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/"], vid: ["BFS Explained", "https://www.youtube.com/watch?v=oDqjPvD54Ss"] },
    { name: "DFS Algorithm",              doc: ["DFS – GFG", "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/"], vid: ["DFS Animated", "https://www.youtube.com/watch?v=7fujbpJ0LB4"] },
    { name: "Sorting: Bubble, Selection, Insertion", doc: ["Sorting Algorithms", "https://www.geeksforgeeks.org/sorting-algorithms/"], vid: ["Sorting Algorithms Visualized", "https://www.youtube.com/watch?v=kPRA0W1kECg"] },
    { name: "Merge Sort & Quick Sort",    doc: ["Merge Sort", "https://www.geeksforgeeks.org/merge-sort/"],              vid: ["Merge Sort vs Quick Sort", "https://www.youtube.com/watch?v=es2T6KY45cA"] },
    { name: "Binary Search",             doc: ["Binary Search", "https://www.geeksforgeeks.org/binary-search/"],        vid: ["Binary Search – CS Dojo", "https://www.youtube.com/watch?v=P3YID7liBug"] },
    { name: "Recursion & Backtracking",  doc: ["Recursion GFG", "https://www.geeksforgeeks.org/recursion/"],            vid: ["Recursion in 100s", "https://www.youtube.com/watch?v=rf60MejMz3E"] },
    { name: "Dynamic Programming Intro", doc: ["DP – GFG", "https://www.geeksforgeeks.org/dynamic-programming/"],      vid: ["DP for Beginners", "https://www.youtube.com/watch?v=oBt53YbR9Kk"] },
    { name: "Greedy Algorithms",         doc: ["Greedy – GFG", "https://www.geeksforgeeks.org/greedy-algorithms/"],    vid: ["Greedy Algorithms", "https://www.youtube.com/watch?v=HzeK7g8cD0Y"] },
    { name: "Trie Data Structure",       doc: ["Trie – GFG", "https://www.geeksforgeeks.org/trie-insert-and-search/"], vid: ["Trie Explained", "https://www.youtube.com/watch?v=oobqoCJlHA0"] },
  ],
  c: [
    { name: "Hello World & Compilation",  doc: ["C Tutorial – TutorialsPoint", "https://www.tutorialspoint.com/cprogramming/c_basic_syntax.htm"], vid: ["C Programming Full Course", "https://www.youtube.com/watch?v=KJgsSFOSQv0"] },
    { name: "Data Types & Variables",     doc: ["C Data Types", "https://www.tutorialspoint.com/cprogramming/c_data_types.htm"], vid: ["C Variables", "https://www.youtube.com/watch?v=4-Dz3SQGrG8"] },
    { name: "printf & scanf",             doc: ["C I/O", "https://www.tutorialspoint.com/cprogramming/c_input_output.htm"], vid: ["C Input/Output", "https://www.youtube.com/watch?v=TNQixKtRzHY"] },
    { name: "Operators & Expressions",    doc: ["C Operators", "https://www.tutorialspoint.com/cprogramming/c_operators.htm"], vid: ["C Operators", "https://www.youtube.com/watch?v=kLCMUVDUREQ"] },
    { name: "if / else / switch",         doc: ["C Control Flow", "https://www.tutorialspoint.com/cprogramming/c_decision_making.htm"], vid: ["C Conditionals", "https://www.youtube.com/watch?v=lTglE5OBM5I"] },
    { name: "Loops: for / while / do-while", doc: ["C Loops", "https://www.tutorialspoint.com/cprogramming/c_loops.htm"], vid: ["C Loops Tutorial", "https://www.youtube.com/watch?v=Aw9i8hm1TcU"] },
    { name: "Functions in C",             doc: ["C Functions", "https://www.tutorialspoint.com/cprogramming/c_functions.htm"], vid: ["C Functions Tutorial", "https://www.youtube.com/watch?v=ikZ0UO_6zy8"] },
    { name: "Arrays in C",                doc: ["C Arrays", "https://www.tutorialspoint.com/cprogramming/c_arrays.htm"], vid: ["Arrays in C", "https://www.youtube.com/watch?v=55l-aZ7_F24"] },
    { name: "Strings in C",               doc: ["C Strings", "https://www.tutorialspoint.com/cprogramming/c_strings.htm"], vid: ["Strings in C", "https://www.youtube.com/watch?v=Bf8a6IC1dE4"] },
    { name: "Pointers & Memory Addresses", doc: ["C Pointers", "https://www.tutorialspoint.com/cprogramming/c_pointers.htm"], vid: ["Pointers Explained – Bro Code", "https://www.youtube.com/watch?v=2ybLD6_2gKM"] },
    { name: "Pointer Arithmetic",         doc: ["Pointer Arithmetic", "https://www.tutorialspoint.com/cprogramming/c_pointer_arithmetic.htm"], vid: ["Pointer Arithmetic C", "https://www.youtube.com/watch?v=q7raUNhhV7w"] },
    { name: "malloc & free (Dynamic Memory)", doc: ["Dynamic Memory", "https://www.tutorialspoint.com/cprogramming/c_memory_management.htm"], vid: ["malloc in C", "https://www.youtube.com/watch?v=xDVC3wKjS64"] },
    { name: "Structures (struct)",         doc: ["C Structs", "https://www.tutorialspoint.com/cprogramming/c_structures.htm"], vid: ["Structs in C", "https://www.youtube.com/watch?v=AABAD1Y0pW4"] },
    { name: "File Handling in C",         doc: ["C File I/O", "https://www.tutorialspoint.com/cprogramming/c_file_io.htm"], vid: ["C File Handling", "https://www.youtube.com/watch?v=DkKDPVMPy8U"] },
    { name: "Recursion in C",             doc: ["C Recursion", "https://www.tutorialspoint.com/cprogramming/c_recursion.htm"], vid: ["C Recursion", "https://www.youtube.com/watch?v=kepBmgvWNDw"] },
  ],
  react: [
    { name: "Vite / CRA Setup & JSX",    doc: ["React Docs", "https://react.dev/learn"], vid: ["React in 100 Seconds – Fireship", "https://www.youtube.com/watch?v=Tn6-PIqc4UM"] },
    { name: "Components & Props",         doc: ["React Components", "https://react.dev/learn/your-first-component"], vid: ["React Components – The Net Ninja", "https://www.youtube.com/watch?v=Y2hgEGPzTZY"] },
    { name: "useState Hook",              doc: ["useState Docs", "https://react.dev/reference/react/useState"], vid: ["useState – Web Dev Simplified", "https://www.youtube.com/watch?v=O6P86uwfdR0"] },
    { name: "Event Handling in React",    doc: ["React Events", "https://react.dev/learn/responding-to-events"], vid: ["React Events Tutorial", "https://www.youtube.com/watch?v=0XSDAup85SA"] },
    { name: "Conditional Rendering",     doc: ["Conditional Rendering", "https://react.dev/learn/conditional-rendering"], vid: ["Conditional Rendering React", "https://www.youtube.com/watch?v=7o5FPaVA9m0"] },
    { name: "Lists & Keys",              doc: ["Rendering Lists", "https://react.dev/learn/rendering-lists"], vid: ["Lists in React", "https://www.youtube.com/watch?v=0sasRxl35_8"] },
    { name: "useEffect Hook",            doc: ["useEffect Docs", "https://react.dev/reference/react/useEffect"], vid: ["useEffect – Web Dev Simplified", "https://www.youtube.com/watch?v=0ZJgIjIuY7U"] },
    { name: "Fetching Data in React",    doc: ["React Data Fetching", "https://react.dev/learn/synchronizing-with-effects"], vid: ["Fetch Data React – Traversy", "https://www.youtube.com/watch?v=T3Px88x_PsA"] },
    { name: "React Router v6",           doc: ["React Router Docs", "https://reactrouter.com/en/main/start/tutorial"], vid: ["React Router – Web Dev Simplified", "https://www.youtube.com/watch?v=Ul3y1LXxzdU"] },
    { name: "Context API & useContext",  doc: ["Context API", "https://react.dev/learn/passing-data-deeply-with-context"], vid: ["Context API – Traversy", "https://www.youtube.com/watch?v=rFnfvhtrNbQ"] },
  ],
  sql: [
    { name: "SELECT, FROM, WHERE",       doc: ["SQLZoo Tutorial", "https://sqlzoo.net/wiki/SELECT_basics"],              vid: ["SQL Basics – freeCodeCamp", "https://www.youtube.com/watch?v=HXV3zeQKqGY"] },
    { name: "ORDER BY, LIMIT, OFFSET",   doc: ["SQL Sorting", "https://mode.com/sql-tutorial/sql-order-by/"],           vid: ["SQL ORDER BY", "https://www.youtube.com/watch?v=p3qvj9hO_Bo"] },
    { name: "Aggregate Functions",       doc: ["SQL Aggregates", "https://mode.com/sql-tutorial/sql-aggregate-functions/"], vid: ["SQL Aggregates", "https://www.youtube.com/watch?v=7mFUkPf4AT8"] },
    { name: "GROUP BY & HAVING",         doc: ["SQL GROUP BY", "https://mode.com/sql-tutorial/sql-group-by/"],           vid: ["GROUP BY Explained", "https://www.youtube.com/watch?v=vjxQw-Kgme8"] },
    { name: "INNER JOIN",                doc: ["SQL Joins – Mode", "https://mode.com/sql-tutorial/sql-joins/"],          vid: ["SQL Joins – TechTFQ", "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"] },
    { name: "LEFT, RIGHT & FULL JOIN",   doc: ["Outer Joins", "https://mode.com/sql-tutorial/sql-outer-joins/"],         vid: ["SQL Outer Joins", "https://www.youtube.com/watch?v=Jh_pvk48jHA"] },
    { name: "Subqueries",                doc: ["SQL Subqueries", "https://mode.com/sql-tutorial/sql-sub-queries/"],      vid: ["Subqueries Explained", "https://www.youtube.com/watch?v=2cy7Mv4iRjY"] },
    { name: "INSERT, UPDATE, DELETE",    doc: ["DML Statements", "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/"], vid: ["SQL DML Statements", "https://www.youtube.com/watch?v=QyWB2EZn2_k"] },
    { name: "Indexes & Performance",     doc: ["SQL Indexes", "https://use-the-index-luke.com/"],                        vid: ["SQL Indexes Explained", "https://www.youtube.com/watch?v=-qNSXK7s7_w"] },
    { name: "Window Functions",          doc: ["Window Functions", "https://mode.com/sql-tutorial/sql-window-functions/"], vid: ["Window Functions SQL", "https://www.youtube.com/watch?v=H6OTMoXjNiM"] },
  ],
};

// ─── Alias map for flexible subject matching ──────────────────────────────
const ALIASES = {
  "dsa": "data structures", "algorithms": "data structures",
  "ds": "data structures", "algo": "data structures",
  "js": "javascript", "es6": "javascript", "node": "javascript",
  "ml": "machine learning", "ai": "machine learning",
  "c programming": "c", "c language": "c",
};

// ─── Quiz bank keyed by lowercase topic fragment ──────────────────────────
const QUIZ_BANK = {
  "variables": [
    { q: "Which keyword declares a block-scoped variable in JS?", options: ["var", "let", "define", "set"], answer: 1 },
    { q: "What is the result of typeof null in JavaScript?", options: ["null", "undefined", "object", "string"], answer: 2 },
  ],
  "arrays": [
    { q: "What is the time complexity of accessing an element in an array?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2 },
    { q: "Which method adds an element to the END of a JavaScript array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0 },
  ],
  "linked list": [
    { q: "What is the time complexity of inserting at the beginning of a linked list?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 0 },
    { q: "What does each node in a linked list contain?", options: ["Only data", "Only a pointer", "Data and a pointer to next", "A key-value pair"], answer: 2 },
  ],
  "pointers": [
    { q: "What operator is used to declare a pointer in C?", options: ["&", "*", "->", "@"], answer: 1 },
    { q: "What does the & operator give you in C?", options: ["Value of variable", "Memory address", "Dereferenced value", "Null pointer"], answer: 1 },
  ],
  "stack": [
    { q: "What principle does a Stack follow?", options: ["FIFO", "LIFO", "LILO", "FILO"], answer: 1 },
    { q: "Which operation adds an element to a stack?", options: ["enqueue", "push", "insert", "add"], answer: 1 },
  ],
  "queue": [
    { q: "What principle does a Queue follow?", options: ["LIFO", "FIFO", "LILO", "Random"], answer: 1 },
    { q: "Which operation removes from a Queue?", options: ["pop", "delete", "dequeue", "pull"], answer: 2 },
  ],
  "sorting": [
    { q: "What is the best case time complexity of Bubble Sort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], answer: 2 },
    { q: "Which sorting algorithm has O(n log n) average time complexity?", options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], answer: 2 },
  ],
  "binary search": [
    { q: "Binary search requires the array to be:", options: ["Sorted", "Unsorted", "Linked", "Hashed"], answer: 0 },
    { q: "Time complexity of Binary Search is:", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2 },
  ],
  "recursion": [
    { q: "Every recursive function must have a:", options: ["Loop", "Base case", "Return statement", "Global variable"], answer: 1 },
    { q: "What is the memory structure used for recursive calls?", options: ["Queue", "Heap", "Stack", "Array"], answer: 2 },
  ],
  "functions": [
    { q: "Arrow functions in JS were introduced in:", options: ["ES3", "ES5", "ES6", "ES8"], answer: 2 },
    { q: "What keyword is used to return a value from a function?", options: ["exit", "output", "return", "yield"], answer: 2 },
  ],
  "classes": [
    { q: "Which keyword is used to create an instance of a class?", options: ["create", "spawn", "new", "init"], answer: 2 },
    { q: "In OOP, inheriting properties from a parent class is called:", options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"], answer: 1 },
  ],
  "dynamic programming": [
    { q: "DP solves problems by breaking them into:", options: ["Greedy steps", "Overlapping subproblems", "Random choices", "Recursive exhaustion"], answer: 1 },
    { q: "Which famous problem is solved with DP?", options: ["Sorting", "BFS", "Fibonacci sequence", "Hashing"], answer: 2 },
  ],
  "join": [
    { q: "Which SQL JOIN returns rows with matching values in BOTH tables?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], answer: 2 },
    { q: "What does a LEFT JOIN return?", options: ["Only matching rows", "All left rows + matching right rows", "All right rows", "Only unique rows"], answer: 1 },
  ],
  "select": [
    { q: "Which SQL clause is used to filter rows?", options: ["FROM", "SELECT", "WHERE", "GROUP BY"], answer: 2 },
    { q: "What does SELECT * do?", options: ["Delete all rows", "Select all columns", "Update all rows", "Create a table"], answer: 1 },
  ],
  "neural": [
    { q: "What is the activation function commonly used in hidden layers?", options: ["Sigmoid", "ReLU", "Linear", "Softmax"], answer: 1 },
    { q: "The process of updating weights in a neural network is called:", options: ["Forward pass", "Backpropagation", "Normalization", "Regularization"], answer: 1 },
  ],
};

// ─── Generate quiz for a topic ────────────────────────────────────────────
function makeQuiz(topicName) {
  const lower = topicName.toLowerCase();
  for (const [key, questions] of Object.entries(QUIZ_BANK)) {
    if (lower.includes(key)) return questions;
  }
  // Generic fallback quiz
  return [
    { q: `What is the main purpose of "${topicName}"?`, options: ["To optimize code", "To structure and organize logic", "To manage memory", "To handle errors"], answer: 1 },
    { q: `Which approach is best when learning "${topicName}"?`, options: ["Only read theory", "Watch videos and never practice", "Learn concepts and immediately build something", "Skip to advanced topics"], answer: 2 },
  ];
}

// ─── Build day-by-day plan ────────────────────────────────────────────────
function buildDayPlan(subject, totalDays) {
  const subjectLower = subject.toLowerCase();
  const resolved = ALIASES[subjectLower] || subjectLower;

  let topicList = null;
  for (const [key, list] of Object.entries(TOPIC_DB)) {
    if (resolved.includes(key) || key.includes(resolved.split(" ")[0])) {
      topicList = list;
      break;
    }
  }

  // Generic day generator — can generate ANY number of days
  if (!topicList) {
    const basePhrases = [
      `What is ${subject} and why learn it?`,
      `Setting up your ${subject} environment`,
      `Core syntax and structure of ${subject}`,
      `Working with data in ${subject}`,
      `Control flow in ${subject}`,
      `Functions and reusable code in ${subject}`,
      `${subject} modules and libraries`,
      `Error handling in ${subject}`,
      `File operations in ${subject}`,
      `Testing your ${subject} code`,
      `OOP concepts in ${subject}`,
      `${subject} design patterns`,
      `Building a small ${subject} project`,
      `${subject} performance optimization`,
      `Deploying a ${subject} application`,
    ];
    return Array.from({ length: totalDays }, (_, i) => {
      const isReviewDay = (i + 1) % 7 === 0;
      const phrase = isReviewDay
        ? `Review & Practice — ${subject} Week ${Math.ceil((i + 1) / 7)}`
        : basePhrases[i % basePhrases.length];
      return {
        day: i + 1,
        topic: phrase,
        description: isReviewDay
          ? `Review everything you learnt this week. Work on a small project combining all topics.`
          : `Study and practice "${phrase}" with hands-on exercises.`,
        docLabel: `${subject} Documentation`,
        docUrl: `https://www.google.com/search?q=${encodeURIComponent(subject + " " + phrase + " docs")}`,
        videoLabel: `${phrase} Tutorial`,
        videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " " + phrase)}`,
        practiceUrl: `https://www.google.com/search?q=${encodeURIComponent(phrase + " practice exercises")}`,
        quiz: makeQuiz(phrase),
      };
    });
  }


  // Map topic list → day objects, cycling topics and inserting review days
  return Array.from({ length: totalDays }, (_, i) => {
    const isReviewDay = (i + 1) % 7 === 0;
    if (isReviewDay) {
      const weekNum = Math.ceil((i + 1) / 7);
      return {
        day: i + 1,
        topic: `Week ${weekNum} Review & Practice`,
        description: `Review all topics from Week ${weekNum}. Build a small project combining what you've learnt. Take the quiz to check your knowledge!`,
        docLabel: `${subject} Cheatsheet`,
        docUrl: `https://www.google.com/search?q=${encodeURIComponent(subject + " cheatsheet week " + weekNum)}`,
        videoLabel: `${subject} Week ${weekNum} Review`,
        videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " review exercises")}`,
        practiceUrl: `https://www.google.com/search?q=${encodeURIComponent(subject + " practice project")}`,
        quiz: makeQuiz(subject),
      };
    }
    const t = topicList[i % topicList.length];
    return {
      day: i + 1,
      topic: t.name,
      description: `Learn **${t.name}** through interactive study and practice. Spend 30 min reading docs, 30 min watching the video, then build a mini exercise.`,
      docLabel: t.doc[0],
      docUrl: t.doc[1],
      videoLabel: t.vid[0],
      videoUrl: t.vid[1],
      practiceUrl: `https://www.google.com/search?q=${encodeURIComponent(t.name + " practice exercises")}`,
      quiz: makeQuiz(t.name),
    };
  });
}





/**
 * Main entry point — generates AI response based on user message.
 */
export async function generateAIResponse(message, aiConfig = { apiKey: "" }) {
  // 1. Use real Gemini if key provided
  if (aiConfig.apiKey && aiConfig.apiKey.startsWith("AIza")) {
    try {
      return await generateRealAIResponse(message, aiConfig);
    } catch (err) {
      console.error("Real AI Error:", err);
    }
  }

  // 2. Smart internal engine
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 700));
  return smartRespond(message);
}

/**
 * Smart response engine — analyzes message and returns contextual answer.
 */
function smartRespond(message) {
  const lower = message.toLowerCase().trim();

  // ── Fun / casual / Telugu responses ─────────────────────────────────────
  if (matchesAny(lower, ["thinnava", "thinnanu", "tinava", "tinnava", "tinnanu"])) {
    const replies = [
      "Haan bro! Nenu tinnanu 🍛 Rice + curry — developer fuel! Nuvvu tinnava? Don't skip meals while coding! 😄",
      "Ayyo, nenu tinnanu! 🍽️ Chaala baagundi today's food. Nuvvu kuda tino bro — brain needs energy to code! 💪",
      "Ha ha ha, nenu tinnanu ra! 😂 Poha and chai — developer breakfast! Study cheyyadaniki energy undali ga? 🔥",
    ];
    return { type: "general", content: replies[Math.floor(Math.random() * replies.length)] };
  }

  if (matchesAny(lower, ["em chestunnav", "em chestunav", "what are you doing", "em chestha"])) {
    return { type: "general", content: "Nenu? Code review chesthunna bro! 😄 Actually nenu ikkade unna — neeku study plan cheyyadaniki ready ga unnanu! Tell me what you want to learn 🚀" };
  }

  if (matchesAny(lower, ["weather", "temperature", "rain", "sunny", "cloudy", "forecast"])) {
    return { type: "general", content: "Ha! Nenu weather check cheyyadaniki window ledu bro 😄 (I'm an AI!)\n\nBut here's what I *do* know:\n- If you're asking about the weather instead of studying... **you're procrastinating** 😂\n- Perfect weather for coding = any weather! ☔☀️❄️\n\nNow tell me — what topic do you want to learn today? 🚀" };
  }

  if (matchesAny(lower, ["joke", "funny", "make me laugh", "tell me a joke"])) {
    const jokes = [
      "Why do programmers prefer dark mode? 🌙\n\nBecause **light attracts bugs!** 🐛😂",
      "A SQL query walks into a bar, walks up to two tables and asks...\n\n**'Can I JOIN you?'** 😂",
      "Why did the JavaScript developer go broke? 🤔\n\nBecause he **null**ified all his savings! 💸😂",
      "How many programmers does it take to change a light bulb?\n\nNone — **that's a hardware problem!** 😂",
      "Why do Java developers wear glasses? 🤓\n\nBecause they **can't C#!** 😂",
    ];
    return { type: "general", content: jokes[Math.floor(Math.random() * jokes.length)] };
  }

  if (matchesAny(lower, ["bored", "boring", "nothing to do", "free time"])) {
    const hour = new Date().getHours();
    const timeMsg = hour < 12 ? "Good morning vibes! 🌅" : hour < 17 ? "Afternoon slump? ☀️" : "Evening mode! 🌙";
    return { type: "general", content: `${timeMsg} Bored aa? Perfect time to learn something! 🎯

Here are some fun things to try:
- **"Create a 30-day Python plan"** — start today!
- **"Joke"** — I'll make you laugh 😄
- **"What is machine learning?"** — mind blown 🤯
- **"Project ideas for JavaScript"** — build something cool

Boredom + coding = future developer! 🚀` };
  }

  if (matchesAny(lower, ["good morning", "good afternoon", "good evening", "good night"])) {
    const hour = new Date().getHours();
    const greetEmoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : hour < 21 ? "🌆" : "🌙";
    return { type: "general", content: `${greetEmoji} ${message.trim()}! Hope you're having an amazing day!

Ready to learn something today? Just tell me a topic and I'll build you a **day-by-day study plan** complete with video lectures, docs, and quizzes! 🎯` };
  }

  // ── Study Plan Creation ──────────────────────────────────────────────────
  if (matchesAny(lower, ["create", "make", "generate", "build me", "give me", "plan for", "roadmap for", "study plan", "schedule for", "i want to learn", "help me learn"])) {
    const { subject, days } = extractPlanDetails(message);
    const dayPlan = buildDayPlan(subject, days);
    return {
      type: "study_plan",
      content: `📚 Here's your **${days}-Day ${subject} Learning Plan**!\n\nEach day has:\n- ✅ **A specific topic** to master\n- 📖 **Documentation** to read\n- ▶️ **A video lecture** to watch\n- 🧪 **A quick quiz** to test yourself\n\nClick on any day below to expand it. Good luck! 💪`,
      planData: { subject, days: dayPlan },
    };
  }

  // ── How long to learn X ──────────────────────────────────────────────────
  if (matchesAny(lower, ["how long", "how many days", "how many weeks", "how many months", "time to learn", "time does it take", "take to learn", "master"])) {
    const topic = extractTopicFromQuestion(message);
    return { type: "general", content: howLongToLearn(topic, lower) };
  }

  // ── Where to start ───────────────────────────────────────────────────────
  if (matchesAny(lower, ["where to start", "how to start", "how do i start", "getting started", "beginner", "absolute beginner", "no experience", "complete beginner", "from scratch", "from zero"])) {
    const topic = extractTopicFromQuestion(message);
    return { type: "general", content: howToStart(topic) };
  }

  // ── Best resources / what to use ─────────────────────────────────────────
  if (matchesAny(lower, ["best resource", "best course", "best book", "recommend", "suggestion", "what should i use", "where to learn", "free course", "udemy", "coursera", "youtube", "tutorial"])) {
    const topic = extractTopicFromQuestion(message);
    return { type: "general", content: bestResources(topic) };
  }

  // ── Compare two things ───────────────────────────────────────────────────
  if (matchesAny(lower, [" vs ", " or ", "difference between", "which is better", "should i learn", "should i choose", "python vs", "react vs", "java vs", "frontend vs", "sql vs"])) {
    return { type: "general", content: compareTopics(message, lower) };
  }

  // ── Career / job / salary ────────────────────────────────────────────────
  if (matchesAny(lower, ["career", "job", "salary", "hire", "interview", "portfolio", "resume", "cv", "work as", "become a", "get a job", "land a job", "developer salary"])) {
    return { type: "general", content: careerAdvice(message, lower) };
  }

  // ── Motivation / stuck / hard ────────────────────────────────────────────
  if (matchesAny(lower, ["motivation", "motivated", "i feel stuck", "giving up", "too hard", "difficult", "can't understand", "cant understand", "not getting it", "confused", "overwhelming", "burnout"])) {
    return { type: "general", content: motivationBoost(message, lower) };
  }

  // ── Time management / study schedule ────────────────────────────────────
  if (matchesAny(lower, ["time management", "daily schedule", "study schedule", "how many hours", "how to study", "study tips", "study technique", "remember", "memorize", "retain", "focus", "distracted", "pomodoro", "spaced repetition"])) {
    return { type: "general", content: studyTips(lower) };
  }

  // ── Projects / portfolio ideas ───────────────────────────────────────────
  if (matchesAny(lower, ["project idea", "what to build", "project for portfolio", "portfolio project", "beginner project", "side project", "practice project", "what should i build"])) {
    const topic = extractTopicFromQuestion(message);
    return { type: "general", content: projectIdeas(topic, lower) };
  }

  // ── Specific technology questions ────────────────────────────────────────
  if (matchesAny(lower, ["what is", "what are", "explain", "tell me about", "define", "describe", "how does", "how do", "why use", "advantages of", "disadvantages of", "pros and cons"])) {
    return { type: "general", content: explainConcept(message, lower) };
  }

  // ── Prerequisites ────────────────────────────────────────────────────────
  if (matchesAny(lower, ["prerequisite", "before learning", "need to know", "requirements", "should i know", "know before", "learn first"])) {
    const topic = extractTopicFromQuestion(message);
    return { type: "general", content: prerequisites(topic, lower) };
  }

  // ── Greetings ────────────────────────────────────────────────────────────
  if (matchesAny(lower, ["hello", "hi", "hey", "good morning", "good evening", "howdy", "what's up", "sup"])) {
    return { type: "general", content: greeting() };
  }

  // ── Thank you ────────────────────────────────────────────────────────────
  if (matchesAny(lower, ["thank", "thanks", "appreciate", "great", "amazing", "awesome", "helpful", "perfect", "love it"])) {
    return { type: "general", content: `You're welcome! 😊 Happy to help.\n\nFeel free to ask me anything else — whether it's about learning paths, specific topics, study tips, or career advice. I'm here for you! 🚀` };
  }

  // ── Fallback: smart catch-all ─────────────────────────────────────────────
  return { type: "general", content: smartFallback(message) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: match any keyword
function matchesAny(lower, keywords) {
  return keywords.some(k => lower.includes(k));
}

// Helper: extract topic from a question
function extractTopicFromQuestion(msg) {
  const lower = msg.toLowerCase();
  const removals = ["how long to learn", "how to start", "best resources for", "best course for", "best book for", "recommend", "what is", "explain", "tell me about", "for learning", "to learn", "i want to learn", "help me learn", "prerequisites for", "before learning", "need to know about", "project ideas for", "what to build with", "how many hours for"];
  let topic = lower;
  removals.forEach(r => { topic = topic.replace(r, ""); });
  return topic.replace(/[?.,!]/g, "").trim() || "programming";
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE GENERATORS
// ─────────────────────────────────────────────────────────────────────────────

function greeting() {
  return `Hey there! 👋 I'm your AI Study Planner.\n\nHere's what I can help you with:\n\n📚 **Create study plans** — *"Create a 30-day Python plan"*\n⏱️ **Time estimates** — *"How long to learn React?"*\n🗺️ **Learning roadmaps** — *"Where do I start with web dev?"*\n🔗 **Resource recommendations** — *"Best free courses for ML?"*\n⚖️ **Comparisons** — *"Python vs JavaScript?"*\n💡 **Project ideas** — *"What should I build to practice React?"*\n🎯 **Career advice** — *"How do I get a job as a developer?"*\n\nWhat would you like to know?`;
}

function howLongToLearn(topic, lower) {
  const estimates = {
    python:    { beginner: "4–8 weeks", job: "6–12 months", note: "Python is beginner-friendly with a gentle learning curve." },
    javascript:{ beginner: "6–10 weeks", job: "8–14 months", note: "JS is vast — mastery takes time, but you can build things early on." },
    react:     { beginner: "3–5 weeks", job: "4–8 months", note: "Requires solid JavaScript fundamentals first." },
    java:      { beginner: "8–12 weeks", job: "10–18 months", note: "Java is verbose but very structured — good for system design." },
    "machine learning": { beginner: "8–12 weeks", job: "12–18 months", note: "Requires Python + Math (stats, linear algebra) as prerequisites." },
    sql:       { beginner: "2–4 weeks", job: "3–6 months", note: "Basic SQL is quick to learn, advanced query optimization takes months." },
    "data science": { beginner: "10–16 weeks", job: "12–20 months", note: "A broad field combining Python, stats, and ML — requires patience." },
    css:       { beginner: "2–4 weeks", job: "3–6 months", note: "Basic CSS is easy; mastering layout (Flexbox, Grid) takes a few weeks." },
    typescript:{ beginner: "2–3 weeks", job: "2–4 months", note: "If you know JS, TypeScript adds just a few extra weeks." },
    "c++":     { beginner: "8–16 weeks", job: "12–24 months", note: "One of the harder languages — especially pointers and memory management." },
    "node.js": { beginner: "3–6 weeks", job: "6–10 months", note: "Requires JavaScript knowledge; backend concepts add learning time." },
    docker:    { beginner: "1–2 weeks", job: "2–4 months", note: "Core concepts are quick; orchestration with Kubernetes adds more time." },
    "cloud":   { beginner: "4–8 weeks", job: "6–12 months", note: "Certifications (AWS/GCP/Azure) give structured timelines of 2–4 months each." },
    cybersecurity: { beginner: "3–6 months", job: "12–24 months", note: "Wide field — networking, OS, and ethical hacking all take time." },
  };

  const topicLower = topic.toLowerCase();
  let match = null;
  for (const [key, val] of Object.entries(estimates)) {
    if (topicLower.includes(key) || key.includes(topicLower.split(" ")[0])) { match = val; break; }
  }

  if (match) {
    return `## ⏱️ How Long to Learn ${topic.charAt(0).toUpperCase() + topic.slice(1)}?\n\n| Stage | Time Estimate |\n|---|---|\n| **Basics (syntax, fundamentals)** | ${match.beginner} |\n| **Job-ready (projects + practice)** | ${match.job} |\n\n> 💡 *${match.note}*\n\n### Factors that affect speed:\n- ⏰ **Time per day** — 1h/day vs 4h/day makes a huge difference\n- 🧠 **Prior experience** — knowing a related language speeds things up\n- 🎯 **Goal** — hobby vs career-level mastery need different depths\n\n**Want me to create a personalized study plan?** Just say:\n*"Create a 30-day ${topic} plan"*`;
  }

  return `## ⏱️ How Long to Learn ${topic}?\n\nIt depends on the complexity and your daily time commitment:\n\n| Daily Time | Basics | Job-Ready |\n|---|---|---|\n| 30 min/day | ~3-4 months | 1-2 years |\n| 1 hr/day | ~6-10 weeks | 8-14 months |\n| 2-3 hrs/day | ~3-5 weeks | 4-8 months |\n\n> The more specific your goal, the faster you can learn what you need. Specialization beats trying to learn everything.\n\n**Want a custom plan?** Say: *"Create a study plan for ${topic}"*`;
}

function howToStart(topic) {
  const cap = topic.charAt(0).toUpperCase() + topic.slice(1) || "programming";
  const roads = {
    "web development": "**Web Development Starter Path:**\n1. 🌐 **HTML** (1 week) — structure of web pages\n2. 🎨 **CSS** (2 weeks) — styling, Flexbox, Grid\n3. ⚡ **JavaScript** (6-8 weeks) — interactivity, DOM, events\n4. ⚛️ **React or Vue** (4-6 weeks) — modern UI frameworks\n5. 🖥️ **Node.js + Express** (3-4 weeks) — backend APIs\n6. 🗄️ **Databases** (2-3 weeks) — SQL or MongoDB\n\n> 🚀 Start building real projects after each stage!",
    python: "**Python Beginner Path:**\n1. 🐍 Install Python + VS Code\n2. 📝 Variables, types, strings, numbers (Week 1)\n3. 🔄 Loops, conditions, functions (Week 2)\n4. 📦 Lists, dicts, sets (Week 3)\n5. 🏗️ Files, OOP, error handling (Week 4)\n6. 🎯 Build your first project!\n\n> 🔗 Best free start: [python.org tutorial](https://docs.python.org/3/tutorial/)",
    javascript: "**JavaScript Beginner Path:**\n1. ✅ Learn basic HTML + CSS first (2 weeks)\n2. 📖 JS fundamentals: variables, types, functions (2 weeks)\n3. 🌐 DOM manipulation, events (2 weeks)\n4. 🔄 Async JS: Promises, fetch (2 weeks)\n5. ⚛️ React basics (4 weeks)\n\n> 🔗 Best free resource: [javascript.info](https://javascript.info/)",
  };

  const topicLower = topic.toLowerCase();
  for (const [key, val] of Object.entries(roads)) {
    if (topicLower.includes(key) || key.includes(topicLower)) return `## 🗺️ Getting Started with ${cap}\n\n${val}\n\n---\nWant me to create a **custom study plan**? Say: *"Create a 30-day ${topic} plan"*`;
  }

  return `## 🗺️ Getting Started with ${cap}\n\n**Step-by-step approach:**\n\n1. **Understand what it is** — Watch a 10-minute overview video on YouTube\n2. **Pick ONE resource** — Don't jump between too many courses\n3. **Set a small goal** — "I'll spend 30 min/day for 2 weeks"\n4. **Build while learning** — Apply every concept immediately\n5. **Join a community** — Reddit, Discord, Stack Overflow\n6. **Don't try to learn everything** — Focus on one skill at a time\n\n> 💡 The biggest beginner mistake is "tutorial hell" — watching too many videos without building anything. **Build first.**\n\n**Want a personalized roadmap?** Say: *"Create a study plan for ${topic}"*`;
}

function bestResources(topic) {
  const cap = topic.charAt(0).toUpperCase() + topic.slice(1) || "this topic";
  const resources = {
    python: [
      { name: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", type: "Free Course" },
      { name: "Python.org Official Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Docs" },
      { name: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/", type: "Free Book" },
      { name: "Real Python", url: "https://realpython.com/", type: "Articles + Courses" },
      { name: "CS50P — Harvard Python", url: "https://cs50.harvard.edu/python/", type: "Free University Course" },
    ],
    javascript: [
      { name: "javascript.info", url: "https://javascript.info/", type: "Free Guide" },
      { name: "The Odin Project", url: "https://www.theodinproject.com/", type: "Free Bootcamp" },
      { name: "freeCodeCamp JS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", type: "Free Course" },
      { name: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "Free Book" },
      { name: "Frontend Mentor", url: "https://www.frontendmentor.io/", type: "Practice Projects" },
    ],
    react: [
      { name: "React Official Docs", url: "https://react.dev/learn", type: "Official Docs" },
      { name: "Scrimba React", url: "https://scrimba.com/learn/learnreact", type: "Interactive" },
      { name: "Kent C. Dodds Blog", url: "https://kentcdodds.com/blog", type: "Advanced Articles" },
      { name: "Josh Comeau CSS for JS", url: "https://css-for-js.dev/", type: "Paid but worth it" },
    ],
    "machine learning": [
      { name: "fast.ai Practical DL", url: "https://www.fast.ai/", type: "Free Course" },
      { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "Free + Practice" },
      { name: "Coursera ML by Andrew Ng", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "Course (audit free)" },
      { name: "StatQuest YouTube", url: "https://www.youtube.com/@statquest", type: "YouTube" },
      { name: "Hands-On ML Book", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/", type: "Book" },
    ],
    "web development": [
      { name: "The Odin Project", url: "https://www.theodinproject.com/", type: "Free Full Bootcamp" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org/", type: "Free Interactive" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/", type: "Reference Docs" },
      { name: "Full Stack Open – Helsinki Uni", url: "https://fullstackopen.com/en/", type: "Free University" },
      { name: "CS50W – Harvard Web", url: "https://cs50.harvard.edu/web/", type: "Free University" },
    ],
  };

  const topicLower = topic.toLowerCase();
  let list = null;
  for (const [key, val] of Object.entries(resources)) {
    if (topicLower.includes(key) || key.includes(topicLower.split(" ")[0])) { list = val; break; }
  }

  if (list) {
    const rows = list.map(r => `| [${r.name}](${r.url}) | ${r.type} |`).join("\n");
    return `## 🔗 Best Resources for ${cap}\n\n| Resource | Type |\n|---|---|\n${rows}\n\n> 💡 **Pro tip:** Pick ONE main resource and stick with it until you're done. Resource-hopping wastes time.\n\n**Want a structured learning plan around these resources?**\nSay: *"Create a 30-day ${topic} study plan"*`;
  }

  return `## 🔗 Resources for ${cap}\n\n**Best places to search:**\n\n| Platform | Best For |\n|---|---|\n| [freeCodeCamp](https://www.freecodecamp.org) | Free structured courses |\n| [Coursera](https://www.coursera.org/search?query=${encodeURIComponent(topic)}) | University-level courses |\n| [YouTube](https://www.youtube.com/results?search_query=learn+${encodeURIComponent(topic)}) | Video tutorials |\n| [Khan Academy](https://www.khanacademy.org/) | Fundamentals & math |\n| [GitHub](https://github.com/search?q=${encodeURIComponent("awesome " + topic)}) | Awesome lists & projects |\n| [Reddit r/learnprogramming](https://www.reddit.com/r/learnprogramming/) | Community advice |\n\n> 💡 Search for *"awesome ${topic}"* on GitHub for curated lists of the best resources.`;
}

function compareTopics(message, lower) {
  const comparisons = {
    "python vs javascript": "## ⚖️ Python vs JavaScript\n\n| | Python | JavaScript |\n|---|---|---|\n| **Best for** | Data Science, ML, automation, scripting | Web development (frontend + backend) |\n| **Learning curve** | Easier (clean syntax) | Moderate (async, prototypes) |\n| **Job market** | 🔥 Very strong (AI/ML boom) | 🔥 Huge (every website uses it) |\n| **Performance** | Slower (interpreted) | Fast in browser, Node.js ok |\n| **Can run in browser** | ❌ No | ✅ Yes |\n| **Backend?** | ✅ Django, Flask, FastAPI | ✅ Node.js, Express |\n\n**Choose Python if:** You want to do Data Science, AI/ML, or automation.\n**Choose JavaScript if:** You want to build websites, apps, or full-stack products.\n\n> 💡 **Long-term?** Learn both. Python for data/AI, JS for interfaces.",
    "python vs java": "## ⚖️ Python vs Java\n\n| | Python | Java |\n|---|---|---|\n| **Syntax** | Simple, fewer lines | Verbose but strict |\n| **Speed** | Slower | Faster (compiled to bytecode) |\n| **Best for** | ML, scripts, startups | Enterprise, Android, large systems |\n| **Job market** | Very strong (AI trend) | Very stable (enterprise) |\n| **Learning curve** | Easier | Steeper |\n\n**Pick Python** for data, ML, or quick prototyping.\n**Pick Java** for enterprise systems, Android, or if your target employers use it.",
    "react vs vue": "## ⚖️ React vs Vue\n\n| | React | Vue |\n|---|---|---|\n| **Made by** | Meta (Facebook) | Evan You (community) |\n| **Learning curve** | Moderate | Easier |\n| **Job market** | 🔥 Much larger | Smaller but growing |\n| **Ecosystem** | Massive | Growing |\n| **Opinionated?** | Low (you choose tools) | More structured |\n\n**Pick React** if you want the most jobs and a large ecosystem.\n**Pick Vue** if you prefer a gentler learning curve and cleaner templates.",
    "frontend vs backend": "## ⚖️ Frontend vs Backend\n\n| | Frontend | Backend |\n|---|---|---|\n| **What you build** | What users see (UI) | What runs on servers (logic, data) |\n| **Languages** | HTML, CSS, JavaScript | Python, Java, Node, Go, PHP... |\n| **Technologies** | React, Vue, Angular | Express, Django, Spring, Rails |\n| **Salary** | $70k–$130k avg | $80k–$150k avg |\n| **Easier to start** | ✅ More visual feedback | More abstract, harder to debug |\n\n**Full-stack** = both. Most modern job ads want full-stack developers.\n\n> 💡 Start with **frontend** — you see results immediately, which keeps motivation high.",
    "sql vs nosql": "## ⚖️ SQL vs NoSQL\n\n| | SQL (Relational) | NoSQL (Non-relational) |\n|---|---|---|\n| **Structure** | Tables with fixed schema | Documents, key-value, graphs |\n| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, Redis, DynamoDB |\n| **Best for** | Structured data, transactions | Flexible, high-scale, unstructured |\n| **Joins** | ✅ Easy | ❌ Complex or none |\n| **Learning curve** | Easier for beginners | Depends on type |\n\n**Use SQL** for most projects — it's the default and most versatile.\n**Use NoSQL** when you have unstructured data or need extreme scale.",
  };

  for (const [key, val] of Object.entries(comparisons)) {
    const terms = key.split(" vs ");
    if (terms.every(t => lower.includes(t))) return { type: "general", content: val };
  }

  return { type: "general", content: `## ⚖️ Comparison\n\nTo give you a proper comparison, could you specify exactly what you want to compare? For example:\n- *"Python vs JavaScript"*\n- *"React vs Vue"*\n- *"Frontend vs Backend"*\n- *"SQL vs NoSQL"*\n\nI have detailed breakdowns for many popular tech comparisons!` };
}

function careerAdvice(message, lower) {
  if (matchesAny(lower, ["salary", "how much", "earn", "pay"])) {
    return `## 💰 Developer Salary Estimates (USD/year)\n\n| Role | Junior | Mid | Senior |\n|---|---|---|---|\n| Frontend Developer | $55k–80k | $80k–110k | $110k–160k |\n| Backend Developer | $60k–85k | $85k–120k | $120k–175k |\n| Full-Stack Developer | $65k–90k | $90k–130k | $130k–190k |\n| Data Scientist | $70k–100k | $100k–140k | $140k–200k |\n| ML Engineer | $90k–130k | $130k–175k | $175k–250k+ |\n| DevOps/Cloud | $75k–110k | $110k–155k | $155k–220k |\n| Cybersecurity | $65k–95k | $95k–130k | $130k–180k |\n\n> 💡 India salaries are 30–50% lower; European salaries vary by country.\n\n**Factors that raise salary:**\n- Building real projects & open-source contributions\n- Communication & system design skills\n- Niche expertise (AI, security, Rust, etc.)`;
  }

  if (matchesAny(lower, ["portfolio", "resume", "cv"])) {
    return `## 📁 Building Your Developer Portfolio\n\n**What to include:**\n\n1. **3–5 Projects** (quality over quantity)\n   - Each project should solve a real problem\n   - Include GitHub link + live demo\n   - Write a short README explaining *what* and *why*\n\n2. **Project ideas by level:**\n   - *Beginner:* To-do app, weather app, calculator\n   - *Intermediate:* Blog with auth, e-commerce clone, REST API\n   - *Advanced:* Real-time chat, ML model deployment, full SaaS product\n\n3. **Where to host:**\n   - [GitHub](https://github.com/) — code\n   - [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) — frontend\n   - [Railway](https://railway.app/) or [Render](https://render.com/) — backend\n\n4. **Portfolio site:** Use [GitHub Pages](https://pages.github.com/) or [Framer](https://www.framer.com/)\n\n> 💡 One great project with a good README beats 10 half-finished ones.`;
  }

  if (matchesAny(lower, ["interview", "prepare for interview"])) {
    return `## 🎯 How to Prepare for Developer Interviews\n\n**1. Data Structures & Algorithms (DSA)**\n- Practice on [LeetCode](https://leetcode.com/) — aim for 100+ easy/medium problems\n- Focus: Arrays, HashMaps, Trees, Graphs, Dynamic Programming\n\n**2. System Design (for mid-senior)**\n- Learn: Load balancers, databases, caching, APIs\n- Resources: [System Design Primer](https://github.com/donnemartin/system-design-primer)\n\n**3. Project Deep Dive**\n- Be ready to explain every line of your portfolio projects\n- "What would you do differently?"\n\n**4. Behavioral Questions (STAR method)**\n- Situation, Task, Action, Result\n- Common: "Tell me about a challenge you faced"\n\n**Timeline:**\n- 💪 **1 month:** LeetCode easy problems daily\n- 🧠 **2 months:** Add medium problems + system design\n- ✅ **3 months:** Mock interviews on [Pramp](https://www.pramp.com/) or [Interviewing.io](https://interviewing.io/)`;
  }

  return `## 🚀 Starting Your Tech Career\n\n**Realistic roadmap to first job:**\n\n| Phase | Duration | Goal |\n|---|---|---|\n| **Learn fundamentals** | 2–3 months | Master one language + basics |\n| **Build projects** | 2–3 months | 3 solid portfolio projects |\n| **LeetCode + DSA** | 1–2 months | 100+ problems |\n| **Apply actively** | 1–3 months | 5–10 applications/week |\n| **First job** | Total: **6–12 months** from zero | 🎉 |\n\n**Most important things:**\n- Build real projects (not just tutorials)\n- Network on LinkedIn actively\n- Apply even if you don't meet 100% of requirements\n- Contribute to open source\n\n> 💡 The job search is a numbers game. Apply widely, improve with each rejection.`;
}

function motivationBoost(message, lower) {
  if (matchesAny(lower, ["burnout", "burnt out", "exhausted", "tired"])) {
    return `## 🔋 Dealing with Burnout\n\nBurnout is real and it's very common in the learning journey. Here's what actually helps:\n\n**Immediate steps:**\n- 🛑 **Take a real break** — 2–7 days away completely (not just "less learning")\n- 😴 **Prioritize sleep** — cognitive performance drops sharply without it\n- 🚶 **Move your body** — even a 20-min walk fixes a lot\n\n**Long-term fixes:**\n- ⏰ **Cap learning time** — 90 minutes focused is better than 8 hours dragging\n- 🎯 **Reconnect with your why** — write down *why* you started learning\n- 🏆 **Celebrate small wins** — completed a tutorial? That counts\n- 👥 **Find community** — learning alone is hard; join Discord groups\n\n> 💡 Burnout often means you've been pushing too hard for too long. Rest is not wasted time — it's required.`;
  }

  if (matchesAny(lower, ["stuck", "can't understand", "not getting it", "confused", "difficult", "too hard"])) {
    return `## 🧩 When You're Stuck\n\nGetting stuck is part of learning — not a sign you're bad at it. Here's what to do:\n\n**The 20-minute rule:**\n1. Spend 20 minutes trying to solve it yourself\n2. Search Google/Stack Overflow — read 3 different sources\n3. If still stuck → ask someone (Discord, Reddit, GitHub issues)\n4. Come back to it tomorrow — sleep literally helps your brain process it\n\n**If a concept isn't clicking:**\n- 🔄 Try a **different resource** — some explanations click better than others\n- 📝 **Teach it** — try explaining it to a rubber duck or write it out\n- 🏗️ **Build something with it** — abstract concepts click when you apply them\n- 🎬 Search YouTube for "*[concept] explained simply*"\n\n> 💡 Every developer gets stuck constantly. The difference is experienced developers know how to get unstuck faster.`;
  }

  return `## 💪 Staying Motivated\n\n**Why motivation fades:** It's not willpower — learning is genuinely hard and the brain resists discomfort.\n\n**What actually works:**\n\n1. **Make it a habit, not a feeling**\n   - Study at the same time every day\n   - Even 20 minutes counts — consistency beats intensity\n\n2. **Track your progress visually**\n   - GitHub contribution graph\n   - A simple checklist (like this app's Task Manager!)\n\n3. **Build things you care about**\n   - Tutorials alone are demotivating — build projects related to your interests\n\n4. **Find your people**\n   - [r/learnprogramming](https://reddit.com/r/learnprogramming)\n   - Dev Discord servers\n   - Local meetups or hackathons\n\n5. **Remember the goal**\n   - Write your "why" on a sticky note near your desk\n\n> 💡 You don't need to feel motivated to study. You need a *system*. Motivation shows up after you start.`;
}

function studyTips(lower) {
  if (matchesAny(lower, ["pomodoro"])) {
    return `## ⏳ The Pomodoro Technique\n\n**How it works:**\n1. 🎯 Choose one task to focus on\n2. ⏱️ Set a timer for **25 minutes** (one "Pomodoro")\n3. 💻 Work with full focus — no distractions\n4. ✅ Take a **5-minute break** when the timer rings\n5. 🔁 After 4 Pomodoros → take a **20–30 minute break**\n\n**Why it works:**\n- Breaks the "I don't know where to start" feeling\n- Creates urgency (you KNOW the timer will go off)\n- Prevents decision fatigue\n- Protects against burnout\n\n> 💡 Use the **Focus Timer in the Habit Tracker** to run Pomodoro sessions — your habits auto-complete when the timer finishes!`;
  }

  if (matchesAny(lower, ["spaced repetition", "flashcard", "anki", "remember", "memorize", "retain"])) {
    return `## 🧠 Spaced Repetition — How Memory Works\n\n**The Forgetting Curve:** You forget 70% of new info within 24 hours without review.\n\n**Spaced Repetition fixes this:**\n- Review new concepts after: 1 day → 3 days → 7 days → 14 days → 30 days\n- Each review strengthens the memory trace\n\n**Tools:**\n- [Anki](https://apps.ankiweb.net/) — the gold standard flashcard app (free)\n- [RemNote](https://www.remnote.com/) — notes + flashcards combined\n- [Quizlet](https://quizlet.com/) — easier to start with\n\n**What to put on cards:**\n- Command syntax (*"What does Array.map() do?"*)\n- Concepts (*"What is Big O notation?"*)\n- Error messages you've seen before\n\n> 💡 10 minutes of Anki review beats re-reading the same chapter twice.`;
  }

  if (matchesAny(lower, ["how many hours", "how long should i study"])) {
    return `## ⏰ How Many Hours Should You Study?\n\n**Quality beats quantity every time.** Here's a realistic guide:\n\n| Your situation | Recommended daily time |\n|---|---|\n| Full-time job/school | 45 min – 1.5 hours |\n| Part-time availability | 2–3 hours |\n| Full-time learning (bootcamp mode) | 4–6 hours max |\n\n**Warning signs you're overdoing it:**\n- Reading the same line 3 times without absorbing it\n- Making silly mistakes you normally wouldn't\n- Dread when you open your laptop\n\n**The rule:** 90 minutes of deep focus > 4 hours of passive watching.\n\n> 💡 Protect your sleep — cognitive function drops 30%+ without proper rest. Learning while sleep-deprived doesn't stick.`;
  }

  return `## 📖 Effective Study Techniques\n\n**Top evidence-based methods:**\n\n| Technique | How to use |\n|---|---|\n| **Active Recall** | Test yourself instead of re-reading |\n| **Spaced Repetition** | Review at increasing intervals (Anki) |\n| **Pomodoro** | 25 min focus → 5 min break |\n| **Feynman Technique** | Explain the concept in simple words |\n| **Project-based** | Build something with every concept |\n| **Rubber Duck Debug** | Talk through the problem out loud |\n\n**Daily study structure:**\n1. 🌅 **5 min:** Review yesterday's notes\n2. 📚 **60–90 min:** Learn new concept (focused)\n3. 🏗️ **30–45 min:** Build / apply it immediately\n4. ✍️ **10 min:** Write a summary in your own words\n\n> 💡 The best study method is the one that involves **doing**, not just watching or reading.`;
}

function projectIdeas(topic, lower) {
  const ideas = {
    python: ["CLI To-Do App", "Web Scraper (news/prices)", "Expense Tracker with CSV", "Basic Chat App with sockets", "Image resizer with Pillow", "Weather CLI using OpenWeatherMap API", "Password Generator", "PDF merger tool", "Discord bot", "Flask blog with SQLite"],
    javascript: ["Interactive Quiz App", "Weather Dashboard (API)", "Kanban Board (drag & drop)", "Markdown Editor with preview", "GitHub Profile Viewer", "Movie search app (TMDB API)", "Real-time chat (WebSockets)", "Budget tracker", "Recipe finder", "Progressive Web App (PWA)"],
    react: ["Personal Portfolio", "E-commerce product listing", "Habit Tracker (with localStorage)", "Movie watchlist app", "Real-time todo with Firebase", "GitHub Issues viewer", "Chat app with Socket.io", "Admin dashboard clone", "Blog with MDX", "Weather dashboard"],
    "machine learning": ["House price predictor", "Email spam classifier", "Handwritten digit recognition (MNIST)", "Sentiment analyzer for tweets", "Movie recommendation system", "Credit card fraud detector", "COVID data dashboard", "Cat vs dog image classifier", "Stock trend analyzer (LSTM)", "Chatbot with transformers"],
    "web development": ["Personal portfolio website", "Restaurant menu site", "Blog with admin panel", "Job board clone", "E-commerce store", "SaaS landing page", "News aggregator", "URL shortener", "Event booking platform", "Social media profile clone"],
    sql: ["Library management system", "Student grade tracker", "Inventory management DB", "Online store queries", "HR system data model", "E-commerce transaction analytics", "Social network schema design"],
  };

  const topicLower = topic.toLowerCase();
  let list = null;
  for (const [key, val] of Object.entries(ideas)) {
    if (topicLower.includes(key) || key.includes(topicLower.split(" ")[0])) { list = val; break; }
  }

  if (list) {
    const items = list.map((p, i) => `${i + 1}. ${p}`).join("\n");
    return `## 🛠️ Project Ideas for ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n${items}\n\n**Tips for choosing:**\n- 🟢 Start with something you'd actually use yourself\n- 🎯 Make it slightly beyond your current skill level\n- 📝 Document it well on GitHub — recruiters look at READMEs\n\n**Want a full study plan to build these skills?** Say:\n*"Create a 30-day ${topic} plan"*`;
  }

  return `## 🛠️ Project Ideas for ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n**General project ideas that work for any tech:**\n\n1. **Personal Portfolio site** — show off your skills\n2. **CRUD App** — create, read, update, delete something meaningful\n3. **API integration** — connect to a real-world API (weather, finance, etc.)\n4. **Clone a popular app** — recreate a feature from Twitter, Reddit, etc.\n5. **Automation tool** — solve a real problem you have\n\n> 💡 The best portfolio projects solve a real problem and have a great README.`;
}

function explainConcept(message, lower) {
  const explanations = {
    "what is api": `## 🔌 What is an API?\n\n**API** = Application Programming Interface.\n\nThink of it as a **waiter in a restaurant:**\n- You (app) make a request\n- The waiter (API) carries it to the kitchen (server)\n- The kitchen sends back your food (data)\n\n**Types:**\n- **REST API** — uses HTTP, returns JSON (most common)\n- **GraphQL** — you ask for exactly what you need\n- **WebSocket** — real-time, two-way communication\n\n**Example:** When your weather app shows the temperature — it's calling a weather API to get that data.\n\n> Every app you use relies on dozens of APIs working together.`,
    "what is react": `## ⚛️ What is React?\n\nReact is a **JavaScript library** for building user interfaces, made by Meta (Facebook).\n\n**Key concepts:**\n- **Components** — reusable UI pieces (like LEGO bricks)\n- **Props** — data passed between components\n- **State** — data that can change over time\n- **Hooks** — functions like useState, useEffect for logic\n\n**Why React?**\n- Huge ecosystem and job market\n- Component reusability saves time\n- Virtual DOM for performance\n- Powers Facebook, Instagram, Airbnb, Netflix dashboards\n\n**Prerequisite:** You need solid JavaScript fundamentals first.`,
    "what is machine learning": `## 🤖 What is Machine Learning?\n\nMachine Learning is teaching computers to **learn from data** instead of explicitly programming every rule.\n\n**Three types:**\n1. **Supervised Learning** — labeled data, learns to predict (spam detection, image recognition)\n2. **Unsupervised Learning** — finds patterns without labels (customer clustering)\n3. **Reinforcement Learning** — learns from rewards/punishments (game AI, robotics)\n\n**Real-world applications:**\n- Recommendation systems (Netflix, Spotify)\n- Self-driving cars\n- Medical diagnosis\n- Voice assistants (Siri, Alexa)\n- Fraud detection\n\n> 💡 To start ML, learn: Python → NumPy → Pandas → Scikit-learn → then deep learning`,
    "what is sql": `## 🗄️ What is SQL?\n\n**SQL** = Structured Query Language — the language for talking to relational databases.\n\n**What it does:**\n\`\`\`sql\nSELECT name, email FROM users WHERE age > 25;\nINSERT INTO users (name, email) VALUES ('Alice', 'alice@email.com');\nUPDATE users SET email = 'new@email.com' WHERE id = 1;\nDELETE FROM users WHERE id = 5;\n\`\`\`\n\n**Popular databases that use SQL:**\n- PostgreSQL (best for production)\n- MySQL (most widely used)\n- SQLite (perfect for learning)\n\n> 💡 SQL is one of the highest ROI skills to learn — it's used in virtually every company.`,
    "what is git": `## 🌿 What is Git?\n\nGit is a **version control system** — it tracks changes to your code over time, like a "save history" for your project.\n\n**Basic workflow:**\n\`\`\`bash\ngit init          # Start tracking\ngit add .         # Stage changes\ngit commit -m "message"  # Save a snapshot\ngit push          # Upload to GitHub\ngit pull          # Get latest changes\n\`\`\`\n\n**Key concepts:**\n- **Repository (repo)** — your project + all history\n- **Branch** — a separate line of development\n- **Commit** — a saved snapshot\n- **Merge** — combining branches\n- **GitHub** — a website that hosts Git repos\n\n> 💡 Learn Git basics in 1 hour. You'll use it every single day as a developer.`,
  };

  const msgLower = message.toLowerCase().replace(/[?]/g, "").trim();
  for (const [key, val] of Object.entries(explanations)) {
    if (msgLower.includes(key)) return { type: "general", content: val };
  }

  return { type: "general", content: `## 💡 Great question!\n\nI don't have a pre-built answer for that specific concept yet, but here's how to find a great explanation:\n\n1. 🔍 Search **"[your topic] explained simply"** on YouTube\n2. 📖 Check **MDN** (for web tech): [developer.mozilla.org](https://developer.mozilla.org)\n3. 📚 Check **GeeksForGeeks**: [geeksforgeeks.org](https://www.geeksforgeeks.org)\n4. 🖥️ Ask on **Stack Overflow**: [stackoverflow.com](https://stackoverflow.com)\n\n> 💡 If you share more details about what specifically you want to know, I can try to help more precisely!` };
}

function prerequisites(topic, lower) {
  const prereqs = {
    react:    ["JavaScript (ES6+) — especially: arrow functions, destructuring, spread, array methods", "HTML & CSS basics", "Basic understanding of npm/Node.js", "Optional but helpful: TypeScript basics"],
    "machine learning": ["Python (intermediate level)", "Math: Linear Algebra basics", "Math: Statistics & Probability basics", "NumPy & Pandas libraries", "Optional: Calculus for deep learning"],
    "node.js": ["JavaScript fundamentals", "Understanding of HTTP/APIs", "Basic command line usage"],
    "next.js": ["React (solid understanding)", "Node.js basics", "JavaScript ES6+", "HTML & CSS"],
    docker:   ["Basic Linux/terminal commands", "Understanding of how servers work", "Optional: One backend language (Python, Node, etc.)"],
    kubernetes: ["Docker solid understanding", "Basic networking concepts", "YAML syntax", "Linux command line"],
    "data science": ["Python programming", "Statistics & Probability", "Linear Algebra basics", "SQL basics", "Optional: Calculus"],
    typescript: ["JavaScript fundamentals (solid)", "Basic understanding of static typing concepts"],
    "android development": ["Java or Kotlin basics", "OOP principles", "Basic software design patterns"],
    "ios development": ["Swift basics", "Xcode familiarity", "OOP & protocols"],
  };

  const topicLower = topic.toLowerCase();
  let list = null;
  for (const [key, val] of Object.entries(prereqs)) {
    if (topicLower.includes(key) || key.includes(topicLower.split(" ")[0])) { list = val; break; }
  }

  const cap = topic.charAt(0).toUpperCase() + topic.slice(1);
  if (list) {
    const items = list.map((p, i) => `${i + 1}. ${p}`).join("\n");
    return `## ✅ Prerequisites for Learning ${cap}\n\n${items}\n\n> 💡 You don't need to master all prerequisites — get "good enough" and start learning ${cap} alongside them.\n\n**Want a plan that covers prerequisites first?** Say:\n*"Create a study plan for ${topic}"*`;
  }

  return `## ✅ Prerequisites for ${cap}\n\nGeneral prerequisites depend on the category:\n\n**If it's programming-related:** Learn one base language first (Python or JavaScript are best)\n**If it's data-related:** Add statistics and SQL\n**If it's infrastructure-related:** Add Linux basics and networking\n\nTell me more specifically what you're trying to learn and I'll give you a precise prerequisite list!`;
}

function smartFallback(message) {
  const q = message.trim();
  return `I want to make sure I give you a useful answer! Here's what I can help with:\n\n📚 **"Create a [topic] study plan for [X] days"**\n⏱️ **"How long to learn [topic]?"**\n🗺️ **"How do I start learning [topic]?"**\n🔗 **"Best resources for [topic]"**\n⚖️ **"Python vs JavaScript"** (compare anything)\n💡 **"Project ideas for [topic]"**\n🎯 **"Career advice for developers"**\n🧠 **"Study tips / Pomodoro / spaced repetition"**\n💪 **"I'm stuck / feeling unmotivated"**\n❓ **"What is [technology]?"**\n✅ **"Prerequisites for [topic]"**\n\nYour question was: *"${q}"*\n\nCould you rephrase it using one of the formats above? I'll give you the most helpful answer I can! 🙌`;
}

/**
 * Calls real Gemini API to generate a high-quality plan
 */
async function generateRealAIResponse(message, config) {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({ model: config.model || "gemini-3.5-flash" });

  const systemPrompt = `
    You are an expert, world-class Education Architect for professional technology certifications. 
    Your goal is to build high-intensity, industry-aligned learning roadmaps that feel like professional certification tracks (inspired by IBM SkillsBuild and GitLab).
    
    CRITICAL DESIGN REQUIREMENTS:
    1. STRUCTURE: Divide the plan into PHASES (e.g., Phase 1: Fundamentals, Phase 2: Core Engineering, Phase 3: Mastery).
    2. GRANULARITY: Provide exactly 5 daily topics for EVERY week/phase. Topics must be technical and specific.
    3. PRAGMATISM: Every phase MUST end with a "Professional Lab Project" — a realistic scenario the user would face in a job.
    4. TONE: Objective, professional, and rigorous. Use industry terminology (e.g., "Attack Vectors", "Data Normalization", "Agile Sprints").
    
    JSON SCHEMA FOR PLAN GENERATION (MANDATORY):
    {
      "markdown": "A high-impact, professional summary of the path. Include 'Prerequisites' and 'Estimated Time to Mastery'. Be structured with ## Headers.",
      "plan": {
        "subject": "(string) Professional Designation (e.g., 'Cybersecurity Defense Specialist')",
        "days": (number) Total roadmap duration in days,
        "curriculum": [
          {
            "title": "Phase 1: [Phase Name]",
            "topics": ["Daily Concept 1", "Daily Concept 2", "Daily Concept 3", "Daily Concept 4", "Daily Concept 5"],
            "practice": "Professional Lab Scenario: Detailed description of the practical challenge."
          }
        ]
      }
    }

    5. If the user is just chatting, be an encouraging Mentor:
    { "markdown": "Encouraging professional mentoring text..." }

    Current User Objective: "${message}"
  `;

  const result = await model.generateContent(systemPrompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Try to find JSOn in the response if it's wrapped in markers
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    
    if (data.plan) {
      return {
        type: "study_plan",
        content: data.markdown,
        planData: data.plan
      };
    }
    
    return {
      type: "general",
      content: data.markdown
    };
  } catch (e) {
    // Fallback if AI didn't return valid JSON
    return {
      type: "general",
      content: text
    };
  }
}
