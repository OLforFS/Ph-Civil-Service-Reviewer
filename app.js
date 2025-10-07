class CivilServiceChat {
    constructor() {
        this.currentTopic = '';
        this.currentMode = '';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.lessons = [];
        this.currentLessonIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.data = {};
        this.timer = null;
        this.timeRemaining = 0;
        
        // Review mode specific variables
        this.currentLesson = null;
        this.currentConceptIndex = 0;
        this.waitingForMoreInput = false;
        this.autoFlowPaused = false;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.loadProgress();
        this.showScreen('home');
    }

    async loadData() {
        try {
            console.log('Attempting to load data.json...'); // Debug
            const response = await fetch('data.json');
            console.log('Fetch response:', response.status, response.statusText); // Debug
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('Raw data length:', text.length); // Debug
            
            this.data = JSON.parse(text);
            console.log('Data loaded successfully. Topics:', Object.keys(this.data)); // Debug log
        } catch (error) {
            console.error('Error loading data:', error);
            // Use embedded data as fallback (CORS issue with file:// protocol)
            console.log('Using fallback embedded data');
            this.data = {
                "constitutional-law": {
                    "name": "Constitutional Law",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Three Branches of Government",
                            "content": "The 1987 Philippine Constitution establishes three co-equal branches:",
                            "points": [
                                "🏛️ **Executive Branch** - President, Vice President, Cabinet (implements laws)",
                                "🏛️ **Legislative Branch** - Senate (24) + House of Representatives (implements laws)", 
                                "🏛️ **Judicial Branch** - Supreme Court + lower courts (interprets laws)",
                                "⚖️ **Checks and Balances** - Each branch can limit the others' power"
                            ],
                            "memory_tip": "💡 **Memory Tip:** **ELJ** - Executive, Legislative, Judicial (co-equal branches)",
                            "example": "📝 **Example:** Congress passes a budget (Legislative), President approves it (Executive), Supreme Court can review if constitutional (Judicial)."
                        },
                        {
                            "id": 2,
                            "title": "Bill of Rights (Article III)",
                            "content": "The Philippine Bill of Rights protects fundamental freedoms:",
                            "points": [
                                "🗣️ **Section 4** - Freedom of speech, expression, assembly, petition",
                                "⛪ **Section 5** - Freedom of religion and worship",
                                "📰 **Section 7** - Right to information on public matters",
                                "🏠 **Section 2** - Right against unreasonable searches and seizures",
                                "⚖️ **Section 1** - Due process and equal protection of laws"
                            ],
                            "memory_tip": "💡 **Remember:** Rights come with responsibilities - exercise them wisely",
                            "example": "📝 **Real Application:** You can criticize government policies (free speech) but cannot incite violence or spread false information that harms others."
                        },
                        {
                            "id": 3,
                            "title": "Presidential System",
                            "content": "The Philippines follows a presidential system of government:",
                            "points": [
                                "👤 **Requirements:** 40+ years old, natural-born Filipino, registered voter, 10+ years resident",
                                "⏰ **Term:** Single 6-year term, no re-election allowed",
                                "🗳️ **Election:** Direct vote by the people, plurality wins",
                                "💼 **Powers:** Chief Executive, Commander-in-Chief, can grant pardons",
                                "🚫 **Impeachment:** House impeaches, Senate tries (2/3 vote to convict)"
                            ],
                            "memory_tip": "💡 **40-6-10 Rule:** 40 years old, 6-year term, 10 years residency",
                            "example": "📝 **Why Single Term:** Prevents abuse of power and allows focus on governance rather than re-election."
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "What are the three co-equal branches of government under the 1987 Constitution?",
                            "type": "multiple-choice",
                            "options": [
                                "Executive, Legislative, Judicial",
                                "Federal, State, Local", 
                                "Senate, House, Supreme Court",
                                "President, Congress, Cabinet",
                                "National, Regional, Local"
                            ],
                            "correct": 0,
                            "explanation": "The 1987 Philippine Constitution establishes three co-equal branches: Executive (headed by President), Legislative (Congress), and Judicial (headed by Supreme Court)."
                        },
                        {
                            "id": 2,
                            "question": "What is the minimum age requirement to serve as President of the Philippines?",
                            "type": "multiple-choice",
                            "options": [
                                "35 years old",
                                "38 years old",
                                "40 years old",
                                "45 years old",
                                "50 years old"
                            ],
                            "correct": 2,
                            "explanation": "Article VII, Section 2 of the 1987 Constitution requires the President to be at least 40 years old, a natural-born Filipino citizen, a registered voter, and a resident of the Philippines for at least 10 years."
                        },
                        {
                            "id": 3,
                            "question": "How many senators compose the Philippine Senate?",
                            "type": "multiple-choice",
                            "options": [
                                "12 senators",
                                "18 senators",
                                "24 senators",
                                "30 senators",
                                "36 senators"
                            ],
                            "correct": 2,
                            "explanation": "Article VI, Section 2 states that the Senate shall be composed of 24 senators elected at-large by qualified voters for a term of 6 years."
                        },
                        {
                            "id": 4,
                            "question": "Which body has the sole power to initiate impeachment proceedings?",
                            "type": "multiple-choice",
                            "options": [
                                "Senate",
                                "House of Representatives",
                                "Supreme Court",
                                "Ombudsman",
                                "COMELEC"
                            ],
                            "correct": 1,
                            "explanation": "Article XI, Section 3 grants the House of Representatives the exclusive power to initiate all cases of impeachment. The Senate then tries and decides impeachment cases."
                        },
                        {
                            "id": 5,
                            "question": "What is the term of office for the President of the Philippines?",
                            "type": "multiple-choice",
                            "options": [
                                "4 years, renewable once",
                                "5 years, renewable once",
                                "6 years, not renewable",
                                "6 years, renewable once",
                                "8 years, not renewable"
                            ],
                            "correct": 2,
                            "explanation": "Article VII, Section 4 provides that the President shall serve for a term of 6 years and shall not be eligible for re-election."
                        },
                        {
                            "id": 6,
                            "question": "Which article of the Constitution contains the Bill of Rights?",
                            "type": "multiple-choice",
                            "options": [
                                "Article I",
                                "Article II",
                                "Article III",
                                "Article IV",
                                "Article V"
                            ],
                            "correct": 2,
                            "explanation": "Article III of the 1987 Constitution contains the Bill of Rights, which enumerates the fundamental rights and freedoms of Filipino citizens."
                        },
                        {
                            "id": 7,
                            "question": "What is the highest court in the Philippines?",
                            "type": "multiple-choice",
                            "options": [
                                "Court of Appeals",
                                "Regional Trial Court",
                                "Supreme Court",
                                "Sandiganbayan",
                                "Court of Tax Appeals"
                            ],
                            "correct": 2,
                            "explanation": "Article VIII, Section 1 establishes the Supreme Court as the highest court of the land with administrative supervision over all courts and court personnel."
                        },
                        {
                            "id": 8,
                            "question": "How many justices compose the Supreme Court?",
                            "type": "multiple-choice",
                            "options": [
                                "11 justices",
                                "13 justices",
                                "15 justices",
                                "17 justices",
                                "19 justices"
                            ],
                            "correct": 2,
                            "explanation": "Article VIII, Section 4 provides that the Supreme Court shall be composed of a Chief Justice and 14 Associate Justices, totaling 15 justices."
                        }
                    ]
                },
                "public-admin": {
                    "name": "Public Administration",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Philippine Civil Service System",
                            "content": "The Philippine civil service is governed by merit and fitness:",
                            "points": [
                                "📋 **Civil Service Commission (CSC)** - Central personnel agency since 1900",
                                "⚖️ **Merit and Fitness** - Hiring based on qualifications, not connections",
                                "📊 **Career Service** - Permanent positions with security of tenure",
                                "🎯 **Non-Career Service** - Temporary, contractual, or political appointments",
                                "📜 **Code of Conduct** - RA 6713 (Code of Conduct and Ethical Standards)"
                            ],
                            "memory_tip": "💡 **CSC = Civil Service Commission** (not Committee or Council)",
                            "example": "📝 **Merit System:** Government jobs go to most qualified applicants through competitive exams, not political connections."
                        },
                        {
                            "id": 2,
                            "title": "Civil Service Examinations",
                            "content": "CSC conducts examinations to ensure qualified public servants:",
                            "points": [
                                "📝 **Professional Level** - For college graduates (RA 1080)",
                                "📚 **Sub-Professional Level** - For high school graduates",
                                "🎓 **Eligibility** - Qualifies you for government positions",
                                "📊 **Passing Rate** - 80% for Professional, 70% for Sub-Professional",
                                "🏆 **Validity** - Lifetime eligibility once you pass"
                            ],
                            "memory_tip": "💡 **80-70 Rule:** 80% Professional, 70% Sub-Professional passing rates",
                            "example": "📝 **Career Path:** Pass CSE → Apply for government jobs → Permanent appointment → Career advancement"
                        },
                        {
                            "id": 3,
                            "title": "Public Service Ethics",
                            "content": "RA 6713 sets ethical standards for public officials:",
                            "points": [
                                "🎯 **Commitment to Public Interest** - Public service over personal gain",
                                "⚖️ **Professionalism** - Competence and excellence in service",
                                "🤝 **Justness and Sincerity** - Fair and honest dealings",
                                "🚫 **Political Neutrality** - No partisan political activities",
                                "💰 **Responsiveness** - Act promptly on public needs"
                            ],
                            "memory_tip": "💡 **SERVE:** Service, Excellence, Responsibility, Values, Ethics",
                            "example": "📝 **Conflict of Interest:** Public officials must avoid situations where personal interests conflict with public duties."
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "What does CSC stand for in Philippine government?",
                            "type": "multiple-choice",
                            "options": [
                                "Civil Service Committee",
                                "Civil Service Commission",
                                "Central Service Council",
                                "Constitutional Service Committee",
                                "Citizen Service Center"
                            ],
                            "correct": 1,
                            "explanation": "CSC stands for Civil Service Commission, the central personnel agency of the Philippine government established in 1900, responsible for administering the civil service system."
                        },
                        {
                            "id": 2,
                            "question": "What is the passing rate for the Professional Level Civil Service Examination?",
                            "type": "multiple-choice",
                            "options": [
                                "70%",
                                "75%",
                                "80%",
                                "85%",
                                "90%"
                            ],
                            "correct": 2,
                            "explanation": "The passing rate for the Professional Level Civil Service Examination is 80%, while the Sub-Professional Level requires 70% to pass."
                        },
                        {
                            "id": 3,
                            "question": "Which law establishes the Code of Conduct and Ethical Standards for Public Officials?",
                            "type": "multiple-choice",
                            "options": [
                                "RA 6713",
                                "RA 1080",
                                "RA 7160",
                                "RA 9184",
                                "RA 3019"
                            ],
                            "correct": 0,
                            "explanation": "Republic Act 6713, also known as the 'Code of Conduct and Ethical Standards for Public Officials and Employees,' establishes the ethical standards for public service."
                        },
                        {
                            "id": 4,
                            "question": "What principle governs hiring in the Philippine civil service?",
                            "type": "multiple-choice",
                            "options": [
                                "Political affiliation",
                                "Merit and fitness",
                                "Seniority system",
                                "Regional representation",
                                "Family connections"
                            ],
                            "correct": 1,
                            "explanation": "The Philippine civil service operates on the principle of merit and fitness, meaning positions are filled based on qualifications and competence, not political connections."
                        },
                        {
                            "id": 5,
                            "question": "What is the minimum educational requirement for the Professional Level CSE?",
                            "type": "multiple-choice",
                            "options": [
                                "High school graduate",
                                "Vocational course graduate",
                                "College graduate",
                                "Master's degree holder",
                                "Doctorate degree holder"
                            ],
                            "correct": 2,
                            "explanation": "The Professional Level Civil Service Examination requires applicants to be college graduates or college seniors with at least 72 credit units."
                        },
                        {
                            "id": 6,
                            "question": "Which of the following is NOT a core value in public service ethics?",
                            "type": "multiple-choice",
                            "options": [
                                "Commitment to public interest",
                                "Professionalism",
                                "Political partisanship",
                                "Justness and sincerity",
                                "Responsiveness to the public"
                            ],
                            "correct": 2,
                            "explanation": "Political partisanship is prohibited in public service. Public officials must maintain political neutrality and avoid partisan political activities while in office."
                        }
                    ]
                },
                "general-knowledge": {
                    "name": "General Information",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Philippine Constitution Fundamentals",
                            "content": "Essential facts about the 1987 Philippine Constitution:",
                            "points": [
                                "📜 **Ratified:** February 2, 1987 (replaced 1973 Constitution)",
                                "🗳️ **Plebiscite:** Approved by 76.37% of Filipino voters",
                                "📖 **Articles:** 18 articles covering government structure and rights",
                                "🏛️ **Sovereignty:** 'Sovereignty resides in the people' (Article II, Section 1)",
                                "⚖️ **Rule of Law:** Philippines is a democratic and republican state"
                            ],
                            "memory_tip": "💡 **1987 Constitution:** Remember 87 = 18 articles, sovereignty in people",
                            "example": "📝 **Preamble:** 'We, the sovereign Filipino people...' establishes people as source of government power."
                        },
                        {
                            "id": 2,
                            "title": "Peace and Human Rights",
                            "content": "Philippines' commitment to peace and human rights:",
                            "points": [
                                "🕊️ **Article II, Section 2:** Philippines renounces war as instrument of national policy",
                                "👥 **Commission on Human Rights:** Constitutional body protecting human rights",
                                "🤝 **Bangsamoro Peace Process:** Autonomous region for Muslim Mindanao",
                                "🛡️ **Universal Declaration:** Philippines signed UDHR in 1948",
                                "⚖️ **Indigenous Rights:** Indigenous Peoples Rights Act (RA 8371)"
                            ],
                            "memory_tip": "💡 **Peace Formula:** Renounce war + Protect rights + Respect diversity = Lasting peace",
                            "example": "📝 **Bangsamoro:** Created through RA 11054 (2018) to address historical injustices in Mindanao."
                        },
                        {
                            "id": 3,
                            "title": "Environment Management and Protection",
                            "content": "Philippine environmental laws and policies:",
                            "points": [
                                "🌱 **Article II, Section 16:** State protects and advances right to balanced ecology",
                                "🏭 **Clean Air Act (RA 8749):** Comprehensive air pollution control program",
                                "💧 **Clean Water Act (RA 9275):** Water quality management and protection",
                                "♻️ **Ecological Solid Waste Management (RA 9003):** Waste reduction and recycling",
                                "🌿 **Climate Change Act (RA 9729):** National framework for climate action"
                            ],
                            "memory_tip": "💡 **Environmental Laws:** Air (8749) + Water (9275) + Waste (9003) + Climate (9729)",
                            "example": "📝 **Constitutional Mandate:** Every Filipino has the right to a balanced and healthful ecology."
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "When was the 1987 Philippine Constitution ratified?",
                            "type": "multiple-choice",
                            "options": [
                                "February 2, 1987",
                                "February 11, 1987",
                                "January 17, 1987",
                                "March 25, 1987",
                                "April 7, 1987"
                            ],
                            "correct": 0,
                            "explanation": "The 1987 Philippine Constitution was ratified on February 2, 1987, through a plebiscite where 76.37% of Filipino voters approved it, replacing the 1973 Constitution."
                        },
                        {
                            "id": 2,
                            "question": "Which article of the Constitution states that 'sovereignty resides in the people'?",
                            "type": "multiple-choice",
                            "options": [
                                "Article I, Section 1",
                                "Article II, Section 1",
                                "Article III, Section 1",
                                "Article IV, Section 1",
                                "Article V, Section 1"
                            ],
                            "correct": 1,
                            "explanation": "Article II, Section 1 of the 1987 Constitution declares that 'sovereignty resides in the people and all government authority emanates from them.'"
                        },
                        {
                            "id": 3,
                            "question": "What does RA 8749 regulate?",
                            "type": "multiple-choice",
                            "options": [
                                "Water pollution",
                                "Air pollution",
                                "Solid waste management",
                                "Climate change",
                                "Noise pollution"
                            ],
                            "correct": 1,
                            "explanation": "Republic Act 8749, known as the Clean Air Act of 1999, provides for a comprehensive air pollution control policy and program in the Philippines."
                        },
                        {
                            "id": 4,
                            "question": "Which law established the Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)?",
                            "type": "multiple-choice",
                            "options": [
                                "RA 11054",
                                "RA 9054",
                                "RA 8371",
                                "RA 7160",
                                "RA 6734"
                            ],
                            "correct": 0,
                            "explanation": "Republic Act 11054, the Bangsamoro Organic Law (BOL), was signed in 2018 and established the Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)."
                        },
                        {
                            "id": 5,
                            "question": "What is the primary function of the Commission on Human Rights?",
                            "type": "multiple-choice",
                            "options": [
                                "Prosecute criminal cases",
                                "Investigate human rights violations",
                                "Make laws on human rights",
                                "Appoint government officials",
                                "Conduct elections"
                            ],
                            "correct": 1,
                            "explanation": "The Commission on Human Rights (CHR) is an independent constitutional body tasked with investigating all forms of human rights violations involving civil and political rights."
                        },
                        {
                            "id": 6,
                            "question": "Which environmental law addresses solid waste management in the Philippines?",
                            "type": "multiple-choice",
                            "options": [
                                "RA 8749 (Clean Air Act)",
                                "RA 9275 (Clean Water Act)",
                                "RA 9003 (Ecological Solid Waste Management Act)",
                                "RA 9729 (Climate Change Act)",
                                "RA 7586 (NIPAS Act)"
                            ],
                            "correct": 2,
                            "explanation": "Republic Act 9003, the Ecological Solid Waste Management Act of 2000, provides for an ecological solid waste management program and creates the necessary institutional mechanisms."
                        }
                    ]
                },
                "mathematics": {
                    "name": "Numerical Ability",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Basic Operations and PEMDAS",
                            "content": "Master order of operations for accurate calculations:",
                            "points": [
                                "🔢 **PEMDAS Rule:** Parentheses, Exponents, Multiplication/Division, Addition/Subtraction",
                                "📊 **Left to Right:** Operations of same priority go left to right",
                                "🧮 **Parentheses First:** Always solve what's in parentheses first",
                                "⚡ **Exponents Second:** Powers and roots come after parentheses",
                                "➗ **Multiply/Divide:** Then multiplication and division (left to right)"
                            ],
                            "memory_tip": "💡 **Please Excuse My Dear Aunt Sally** - PEMDAS memory device",
                            "example": "📝 **Example:** 2 + 3 × 4² - (10 ÷ 2) = 2 + 3 × 16 - 5 = 2 + 48 - 5 = 45"
                        },
                        {
                            "id": 2,
                            "title": "Number Sequences and Patterns",
                            "content": "Identify and continue numerical patterns:",
                            "points": [
                                "🔢 **Arithmetic:** Add/subtract constant (5,8,11,14... +3 each)",
                                "📈 **Geometric:** Multiply/divide constant (3,6,12,24... ×2 each)",
                                "🔄 **Fibonacci:** Sum of previous two (1,1,2,3,5,8,13...)",
                                "🎯 **Squares:** Perfect squares (1,4,9,16,25,36...)",
                                "🧮 **Mixed:** Alternating operations or multiple patterns"
                            ],
                            "memory_tip": "💡 **Pattern Strategy:** Find difference between consecutive terms first",
                            "example": "📝 **Arithmetic:** 7,12,17,22,? → +5 each time → Answer: 27"
                        },
                        {
                            "id": 3,
                            "title": "Work, Time, and Percentage Problems",
                            "content": "Solve practical word problems for government scenarios:",
                            "points": [
                                "⏰ **Work Rate:** Work = Rate × Time (W = R × T)",
                                "👥 **Combined Work:** 1/A + 1/B = 1/Together time",
                                "📊 **Percentage:** Part/Whole × 100, increase/decrease formulas",
                                "💰 **Money Problems:** Interest, discounts, budget allocations",
                                "🚗 **Distance:** Distance = Speed × Time (D = S × T)"
                            ],
                            "memory_tip": "💡 **Work Formula:** If A does job in 6 hours, rate = 1/6 job per hour",
                            "example": "📝 **Work Problem:** If 3 clerks process 45 forms in 5 hours, rate per clerk = 45÷(3×5) = 3 forms/hour"
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "What is 25% of 480?",
                            "type": "multiple-choice",
                            "options": [
                                "110",
                                "115",
                                "120",
                                "125",
                                "130"
                            ],
                            "correct": 2,
                            "explanation": "To find 25% of 480: (25/100) × 480 = 0.25 × 480 = 120. Alternatively, 25% = 1/4, so 480 ÷ 4 = 120."
                        },
                        {
                            "id": 2,
                            "question": "If a government employee's salary increased from ₱20,000 to ₱23,000, what is the percentage increase?",
                            "type": "multiple-choice",
                            "options": [
                                "13%",
                                "15%",
                                "17%",
                                "20%",
                                "23%"
                            ],
                            "correct": 1,
                            "explanation": "Percentage increase = ((New-Old)/Old) × 100 = ((23,000-20,000)/20,000) × 100 = (3,000/20,000) × 100 = 15%"
                        },
                        {
                            "id": 3,
                            "question": "What is the next number in the series: 5, 11, 17, 23, ?",
                            "type": "multiple-choice",
                            "options": [
                                "27",
                                "29",
                                "31",
                                "33",
                                "35"
                            ],
                            "correct": 1,
                            "explanation": "This is an arithmetic series where each number increases by 6: 5+6=11, 11+6=17, 17+6=23, 23+6=29."
                        },
                        {
                            "id": 4,
                            "question": "A rectangular office has a length of 12 meters and width of 8 meters. What is its area?",
                            "type": "multiple-choice",
                            "options": [
                                "40 square meters",
                                "80 square meters",
                                "96 square meters",
                                "160 square meters",
                                "192 square meters"
                            ],
                            "correct": 2,
                            "explanation": "Area of rectangle = length × width = 12 m × 8 m = 96 square meters."
                        },
                        {
                            "id": 5,
                            "question": "If 3 clerks can process 45 documents in 5 hours, how many documents can 5 clerks process in 8 hours?",
                            "type": "multiple-choice",
                            "options": [
                                "100",
                                "110",
                                "120",
                                "130",
                                "140"
                            ],
                            "correct": 2,
                            "explanation": "Rate per clerk per hour = 45÷(3×5) = 3 documents. For 5 clerks in 8 hours: 5×8×3 = 120 documents."
                        },
                        {
                            "id": 6,
                            "question": "What is the sum of angles in a triangle?",
                            "type": "multiple-choice",
                            "options": [
                                "90 degrees",
                                "120 degrees",
                                "180 degrees",
                                "270 degrees",
                                "360 degrees"
                            ],
                            "correct": 2,
                            "explanation": "The sum of interior angles in any triangle is always 180 degrees. This is a fundamental geometric principle."
                        },
                        {
                            "id": 7,
                            "question": "A circular park has a radius of 14 meters. What is its approximate area? (Use π = 3.14)",
                            "type": "multiple-choice",
                            "options": [
                                "154 square meters",
                                "308 square meters",
                                "462 square meters",
                                "616 square meters",
                                "924 square meters"
                            ],
                            "correct": 3,
                            "explanation": "Area of circle = πr² = 3.14 × 14² = 3.14 × 196 = 615.44 ≈ 616 square meters."
                        },
                        {
                            "id": 8,
                            "question": "What is the next number in the geometric series: 2, 6, 18, 54, ?",
                            "type": "multiple-choice",
                            "options": [
                                "108",
                                "126",
                                "144",
                                "162",
                                "180"
                            ],
                            "correct": 3,
                            "explanation": "This is a geometric series where each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162."
                        },
                        {
                            "id": 9,
                            "question": "Solve using PEMDAS: 8 + 2 × (6 - 3)² ÷ 3",
                            "type": "multiple-choice",
                            "options": [
                                "14",
                                "16",
                                "18",
                                "20",
                                "24"
                            ],
                            "correct": 1,
                            "explanation": "Following PEMDAS: 8 + 2 × (6-3)² ÷ 3 = 8 + 2 × 3² ÷ 3 = 8 + 2 × 9 ÷ 3 = 8 + 18 ÷ 3 = 8 + 6 = 14"
                        },
                        {
                            "id": 10,
                            "question": "If 4 government employees can process 120 documents in 6 hours, how many documents can 6 employees process in 8 hours?",
                            "type": "multiple-choice",
                            "options": [
                                "180",
                                "200",
                                "240",
                                "280",
                                "320"
                            ],
                            "correct": 2,
                            "explanation": "Rate per employee per hour = 120÷(4×6) = 5 documents. For 6 employees in 8 hours: 6×8×5 = 240 documents."
                        },
                        {
                            "id": 11,
                            "question": "What is the next number in the sequence: 1, 4, 9, 16, 25, ?",
                            "type": "multiple-choice",
                            "options": [
                                "30",
                                "32",
                                "35",
                                "36",
                                "40"
                            ],
                            "correct": 3,
                            "explanation": "This is a sequence of perfect squares: 1², 2², 3², 4², 5², 6² = 1, 4, 9, 16, 25, 36."
                        },
                        {
                            "id": 12,
                            "question": "A department's budget decreased from ₱800,000 to ₱720,000. What is the percentage decrease?",
                            "type": "multiple-choice",
                            "options": [
                                "8%",
                                "10%",
                                "12%",
                                "15%",
                                "20%"
                            ],
                            "correct": 1,
                            "explanation": "Percentage decrease = ((Old-New)/Old) × 100 = ((800,000-720,000)/800,000) × 100 = (80,000/800,000) × 100 = 10%"
                        },
                        {
                            "id": 13,
                            "question": "If Employee A can complete a task in 12 hours and Employee B can complete the same task in 8 hours, how long will it take them working together?",
                            "type": "multiple-choice",
                            "options": [
                                "4.8 hours",
                                "5.2 hours",
                                "6.0 hours",
                                "10.0 hours",
                                "20.0 hours"
                            ],
                            "correct": 0,
                            "explanation": "Combined rate = 1/12 + 1/8 = 2/24 + 3/24 = 5/24 tasks per hour. Time = 1 ÷ (5/24) = 24/5 = 4.8 hours."
                        }
                    ]
                },
                "analytical-ability": {
                    "name": "Analytical Ability",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Word Analogies Fundamentals",
                            "content": "Master word relationships for analytical reasoning:",
                            "points": [
                                "🔗 **Relationship Types:** Synonyms, antonyms, part-to-whole, cause-effect",
                                "📝 **Format:** A is to B as C is to ? (A:B::C:?)",
                                "🎯 **Strategy:** Identify the relationship first, then apply to second pair",
                                "🔍 **Common Types:** Function, classification, degree, sequence",
                                "⚡ **Quick Method:** Make a sentence with first pair, apply to second"
                            ],
                            "memory_tip": "💡 **Bridge Sentence:** Create a sentence connecting the first pair, then use same relationship for second pair",
                            "example": "📝 **Example:** DOCTOR:HOSPITAL::TEACHER:? Answer: SCHOOL (both work in their respective institutions)"
                        },
                        {
                            "id": 2,
                            "title": "Types of Word Relationships",
                            "content": "Common analogy patterns in civil service exams:",
                            "points": [
                                "👥 **Synonyms:** Words with similar meanings (happy:joyful)",
                                "↔️ **Antonyms:** Words with opposite meanings (hot:cold)",
                                "🏗️ **Part to Whole:** Component to complete item (wheel:car)",
                                "⚙️ **Function:** Tool to its purpose (hammer:nail)",
                                "📊 **Degree:** Intensity levels (warm:hot, like:love)"
                            ],
                            "memory_tip": "💡 **SAPFD:** Synonyms, Antonyms, Part-whole, Function, Degree - main relationship types",
                            "example": "📝 **Function Example:** PEN:WRITE::KNIFE:CUT (both are tools used for specific actions)"
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "BOOK : LIBRARY :: MEDICINE : ?",
                            "type": "multiple-choice",
                            "options": [
                                "Doctor",
                                "Hospital",
                                "Pharmacy",
                                "Patient",
                                "Prescription"
                            ],
                            "correct": 2,
                            "explanation": "Books are stored and dispensed in libraries; medicines are stored and dispensed in pharmacies. The relationship is item to storage/distribution location."
                        },
                        {
                            "id": 2,
                            "question": "TEACHER : STUDENT :: DOCTOR : ?",
                            "type": "multiple-choice",
                            "options": [
                                "Medicine",
                                "Hospital",
                                "Patient",
                                "Nurse",
                                "Stethoscope"
                            ],
                            "correct": 2,
                            "explanation": "A teacher provides education to students; a doctor provides medical care to patients. The relationship is professional to the person they serve."
                        },
                        {
                            "id": 3,
                            "question": "HAPPY : ECSTATIC :: WARM : ?",
                            "type": "multiple-choice",
                            "options": [
                                "Cold",
                                "Cool",
                                "Hot",
                                "Freezing",
                                "Mild"
                            ],
                            "correct": 2,
                            "explanation": "Happy and ecstatic show degrees of positive emotion (mild to intense); warm and hot show degrees of temperature (mild to intense). This is a degree relationship."
                        },
                        {
                            "id": 4,
                            "question": "WHEEL : CAR :: WING : ?",
                            "type": "multiple-choice",
                            "options": [
                                "Bird",
                                "Airplane",
                                "Feather",
                                "Sky",
                                "Flight"
                            ],
                            "correct": 1,
                            "explanation": "A wheel is a part of a car that enables movement; a wing is a part of an airplane that enables flight. This is a part-to-whole relationship with function."
                        },
                        {
                            "id": 5,
                            "question": "AUTHOR : BOOK :: COMPOSER : ?",
                            "type": "multiple-choice",
                            "options": [
                                "Music",
                                "Symphony",
                                "Piano",
                                "Orchestra",
                                "Concert"
                            ],
                            "correct": 1,
                            "explanation": "An author creates books; a composer creates symphonies (or musical compositions). The relationship is creator to creation."
                        },
                        {
                            "id": 6,
                            "question": "BEGINNING : END :: SUNRISE : ?",
                            "type": "multiple-choice",
                            "options": [
                                "Morning",
                                "Sunset",
                                "Noon",
                                "Dawn",
                                "Evening"
                            ],
                            "correct": 1,
                            "explanation": "Beginning and end are opposites; sunrise and sunset are opposites (start and end of daylight). This is an antonym relationship."
                        }
                    ]
                },
                "reading-comprehension": {
                    "name": "Reading Comprehension",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Reading Strategies for Civil Service Exams",
                            "content": "Master effective reading techniques for exam success:",
                            "points": [
                                "📖 **Active Reading:** Engage with text by asking questions and making connections",
                                "🎯 **Main Ideas:** Look for topic sentences and concluding statements",
                                "🔍 **Context Clues:** Use surrounding words to understand unfamiliar terms",
                                "📝 **Note-taking:** Jot down key points and relationships between ideas",
                                "⏱️ **Time Management:** Spend 2-3 minutes reading, 1-2 minutes per question"
                            ],
                            "memory_tip": "💡 **SQ3R Method:** Survey, Question, Read, Recite, Review for better comprehension",
                            "example": "📝 **Practice:** Read the title and first sentence to predict what the passage will discuss."
                        },
                        {
                            "id": 2,
                            "title": "Types of Reading Questions",
                            "content": "Common question types in civil service reading comprehension:",
                            "points": [
                                "🎯 **Main Idea:** What is the passage primarily about?",
                                "📋 **Supporting Details:** Specific facts or examples mentioned",
                                "🔮 **Inference:** Conclusions drawn from given information",
                                "📚 **Vocabulary:** Meaning of words in context",
                                "🏗️ **Organization:** How ideas are structured and connected"
                            ],
                            "memory_tip": "💡 **Question Types:** Main + Details + Inference + Vocabulary + Structure = Complete understanding",
                            "example": "📝 **Inference Example:** If passage mentions 'rising temperatures,' you might infer climate change effects."
                        }
                    ],
                    "passages": [
                        {
                            "id": 1,
                            "title": "The Bayanihan Spirit in Modern Philippines",
                            "text": "The concept of Bayanihan, derived from the Filipino word 'bayan' meaning community, represents the spirit of communal unity and cooperation that has long been a cornerstone of Filipino culture. Traditionally exemplified by neighbors coming together to literally lift and move a house to a new location, Bayanihan has evolved to meet the challenges of modern Philippine society. During natural disasters, which frequently affect the archipelago, this spirit manifests in communities organizing relief efforts, sharing resources, and rebuilding together. The COVID-19 pandemic further highlighted the relevance of Bayanihan, as Filipinos worldwide organized mutual aid networks, supported frontline workers, and adapted traditional practices to digital platforms. Government programs have also adopted this concept, with the Bayanihan Acts of 2020 and 2021 providing emergency powers to address the pandemic. However, critics argue that while Bayanihan promotes solidarity, it can sometimes mask systemic issues that require structural solutions rather than community goodwill alone.",
                            "questions": [
                                {
                                    "id": 1,
                                    "question": "What is the main idea of the passage?",
                                    "options": [
                                        "Bayanihan is only relevant during natural disasters",
                                        "The Bayanihan spirit has adapted to address modern challenges in Philippine society",
                                        "Government programs are the best example of Bayanihan",
                                        "Traditional Bayanihan practices are no longer useful",
                                        "COVID-19 destroyed the Bayanihan spirit in the Philippines"
                                    ],
                                    "correct": 1,
                                    "explanation": "The passage discusses how the traditional concept of Bayanihan has evolved and adapted to address contemporary challenges in Philippine society, from natural disasters to the COVID-19 pandemic."
                                },
                                {
                                    "id": 2,
                                    "question": "According to the passage, what does the word 'bayan' mean?",
                                    "options": [
                                        "House",
                                        "Community",
                                        "Cooperation",
                                        "Spirit",
                                        "Tradition"
                                    ],
                                    "correct": 1,
                                    "explanation": "The passage explicitly states that Bayanihan is 'derived from the Filipino word bayan meaning community.'"
                                },
                                {
                                    "id": 3,
                                    "question": "What criticism of Bayanihan is mentioned in the passage?",
                                    "options": [
                                        "It is too expensive to implement",
                                        "It only works in rural areas",
                                        "It can mask systemic issues that need structural solutions",
                                        "It is not compatible with modern technology",
                                        "It creates too much government dependency"
                                    ],
                                    "correct": 2,
                                    "explanation": "The passage states that critics argue Bayanihan 'can sometimes mask systemic issues that require structural solutions rather than community goodwill alone.'"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "title": "Digital Transformation in Philippine Government Services",
                            "text": "The Philippine government has embarked on an ambitious digital transformation initiative aimed at improving public service delivery and increasing government efficiency. The Digital Government Master Plan 2022-2028 outlines strategies to digitize government processes, enhance cybersecurity, and promote digital literacy among public servants. Key achievements include the implementation of the Philippine Identification System (PhilSys), which provides a unified national ID, and the expansion of online services through platforms like the Government Service Insurance System (GSIS) portal and the Social Security System (SSS) mobile app. The COVID-19 pandemic accelerated these efforts, as lockdown measures necessitated remote service delivery. However, challenges remain significant. The digital divide affects both government agencies and citizens, with rural areas often lacking reliable internet connectivity. Additionally, concerns about data privacy and cybersecurity have emerged, particularly following several high-profile data breaches in government systems. Training government employees in digital skills and ensuring equitable access to technology across all regions remain critical priorities for the successful implementation of digital government services.",
                            "questions": [
                                {
                                    "id": 4,
                                    "question": "What is the time frame of the Digital Government Master Plan mentioned in the passage?",
                                    "options": [
                                        "2020-2026",
                                        "2021-2027",
                                        "2022-2028",
                                        "2023-2029",
                                        "2024-2030"
                                    ],
                                    "correct": 2,
                                    "explanation": "The passage specifically mentions 'The Digital Government Master Plan 2022-2028' as the framework for the Philippines' digital transformation initiative."
                                },
                                {
                                    "id": 5,
                                    "question": "Which factor accelerated the government's digital transformation efforts?",
                                    "options": [
                                        "International pressure",
                                        "Budget increases",
                                        "The COVID-19 pandemic",
                                        "New leadership",
                                        "Technological advances"
                                    ],
                                    "correct": 2,
                                    "explanation": "The passage states that 'The COVID-19 pandemic accelerated these efforts, as lockdown measures necessitated remote service delivery.'"
                                },
                                {
                                    "id": 6,
                                    "question": "What can be inferred about the digital divide mentioned in the passage?",
                                    "options": [
                                        "It only affects government agencies",
                                        "It is limited to urban areas",
                                        "It creates unequal access to digital government services",
                                        "It has been completely resolved",
                                        "It only involves cybersecurity issues"
                                    ],
                                    "correct": 2,
                                    "explanation": "The passage indicates that the digital divide 'affects both government agencies and citizens, with rural areas often lacking reliable internet connectivity,' implying unequal access to digital services."
                                }
                            ]
                        }
                    ]
                },
                "english": {
                    "name": "English Comprehension",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Grammar Fundamentals",
                            "content": "Essential grammar rules for civil service exams:",
                            "points": [
                                "📝 **Subject-Verb Agreement:** Singular subjects take singular verbs",
                                "🔤 **Spelling Rules:** 'i before e except after c' (with exceptions)",
                                "📖 **Sentence Structure:** Subject + Verb + Object",
                                "✏️ **Common Errors:** Their/There/They're, Your/You're"
                            ],
                            "memory_tip": "💡 **Team Rule:** 'Team' is singular → 'The team IS playing' (not ARE)",
                            "example": "📝 **Example:** 'The team is winning' vs 'The players are winning'"
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "Choose the correct sentence:",
                            "type": "multiple-choice",
                            "options": [
                                "The team are playing well.",
                                "The team is playing well.",
                                "The team were playing well.",
                                "The team have playing well.",
                                "The team has playing well."
                            ],
                            "correct": 1,
                            "explanation": "When 'team' refers to the group as a single unit, use singular verb 'is'. 'The team is playing well' is correct."
                        }
                    ]
                }
            };
        }
    }

    setupEventListeners() {
        // Mode selection buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.startSession(mode);
            });
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('home');
        });

        // Send button
        document.getElementById('send-btn').addEventListener('click', () => {
            this.handleUserInput();
        });

        // Enter key in input
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });

        // Next button
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Finish button
        document.getElementById('finish-btn').addEventListener('click', () => {
            this.finishSession();
        });
    }

    showScreen(screenName) {
        console.log('Switching to screen:', screenName); // Debug
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            console.log('Hiding screen:', screen.id); // Debug
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log('Showing screen:', targetScreen.id); // Debug
        } else {
            console.error('Screen not found:', `${screenName}-screen`);
        }
    }

    startSession(mode) {
        const topicSelect = document.getElementById('topic-select');
        this.currentTopic = topicSelect.value;
        this.currentMode = mode;
        
        console.log('Starting session:', mode, 'Topic:', this.currentTopic); // Debug
        console.log('Available topics:', Object.keys(this.data)); // Debug
        
        if (!this.data[this.currentTopic]) {
            console.error('Topic not found:', this.currentTopic, 'Available:', Object.keys(this.data));
            alert(`Topic "${this.currentTopic}" not available yet!`);
            return;
        }

        if (mode === 'review') {
            // Review mode uses lessons instead of questions
            this.lessons = [...this.data[this.currentTopic].lessons || []];
            this.currentLessonIndex = 0;
            console.log('Review mode - lessons loaded:', this.lessons.length); // Debug log
        } else {
            // Practice and Mock Exam use questions
            if (this.currentTopic === 'reading-comprehension' && this.data[this.currentTopic].passages) {
                // For reading comprehension, create questions array from passages
                this.readingQuestions = [];
                this.data[this.currentTopic].passages.forEach(passage => {
                    passage.questions.forEach(q => {
                        this.readingQuestions.push({
                            ...q,
                            passageTitle: passage.title,
                            passageText: passage.text,
                            passageId: passage.id
                        });
                    });
                });
                this.questions = this.readingQuestions; // For progress tracking
            } else {
                this.questions = [...this.data[this.currentTopic].questions || []];
            }
            
            this.currentQuestionIndex = 0;
            this.userAnswers = [];
            this.score = 0;
            this.lastPassageId = null;

            // Shuffle questions for mock exam
            if (mode === 'mock-exam') {
                this.shuffleArray(this.questions);
            }
        }

        this.showScreen('chat');
        this.updateChatHeader();
        this.clearChat();
        
        // Start timer for mock exams
        if (mode === 'mock-exam') {
            this.startTimer(30); // 30 minutes for mock exam
        }
        
        this.startChat();
    }

    updateChatHeader() {
        document.getElementById('current-topic').textContent = this.data[this.currentTopic].name;
        document.getElementById('current-mode').textContent = this.getModeDisplayName(this.currentMode);
        this.updateQuestionProgress();
    }

    getModeDisplayName(mode) {
        const modes = {
            'practice': 'Practice Mode',
            'mock-exam': 'Mock Exam',
            'review': 'Review Mode'
        };
        return modes[mode] || mode;
    }

    updateQuestionProgress() {
        const progress = document.getElementById('question-progress');
        if (this.currentMode === 'review') {
            progress.textContent = `${this.currentLessonIndex + 1}/${this.lessons.length}`;
        } else {
            progress.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
        }
    }

    clearChat() {
        document.getElementById('chat-messages').innerHTML = '';
    }

    startChat() {
        const welcomeMessage = this.getWelcomeMessage();
        this.addMessage('bot', welcomeMessage);
        
        setTimeout(() => {
            if (this.currentMode === 'review') {
                this.showCurrentLesson();
            } else {
                this.showCurrentQuestion();
            }
        }, 1000);
    }

    getWelcomeMessage() {
        const topicName = this.data[this.currentTopic].name;
        const messages = {
            'practice': `Welcome to ${topicName} practice! I'll ask you questions and provide detailed explanations. Ready to learn? 📚`,
            'mock-exam': `Starting ${topicName} mock exam! You'll have ${this.questions.length} questions. Answer carefully - this simulates the real exam! ⏱️`,
            'review': `Welcome to ${topicName} review! 📖 I'll teach you key concepts step by step with examples and memory tips. Let's build your knowledge foundation!`
        };
        return messages[this.currentMode] || `Let's study ${topicName} together!`;
    }

    showCurrentQuestion() {
        // Check if this is reading comprehension and handle differently
        if (this.currentTopic === 'reading-comprehension' && this.data[this.currentTopic].passages) {
            this.showReadingComprehensionQuestion();
            return;
        }

        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishSession();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        console.log('Current question:', question); // Debug log
        
        this.addMessage('bot', question.question);

        // All questions are now multiple choice
        if (question.options && Array.isArray(question.options)) {
            this.showMultipleChoiceOptions(question.options);
        } else {
            console.error('Question missing options:', question);
            this.addMessage('bot', 'Sorry, there seems to be an issue with this question. Please try another topic.');
        }
        
        this.updateQuestionProgress();
    }

    showReadingComprehensionQuestion() {
        const passages = this.data[this.currentTopic].passages;
        if (!passages || passages.length === 0) {
            this.addMessage('bot', 'No reading passages available.');
            return;
        }

        // Create a flat array of all questions from all passages
        if (!this.readingQuestions) {
            this.readingQuestions = [];
            passages.forEach(passage => {
                passage.questions.forEach(q => {
                    this.readingQuestions.push({
                        ...q,
                        passageTitle: passage.title,
                        passageText: passage.text,
                        passageId: passage.id
                    });
                });
            });
        }

        if (this.currentQuestionIndex >= this.readingQuestions.length) {
            this.finishSession();
            return;
        }

        const currentQ = this.readingQuestions[this.currentQuestionIndex];
        
        // Show passage if it's the first question from this passage
        const isNewPassage = !this.lastPassageId || this.lastPassageId !== currentQ.passageId;
        
        if (isNewPassage) {
            this.addMessage('bot', `📖 **${currentQ.passageTitle}**`);
            setTimeout(() => {
                this.addMessage('bot', currentQ.passageText);
            }, 800);
            setTimeout(() => {
                this.addMessage('bot', `**Question ${this.currentQuestionIndex + 1}:** ${currentQ.question}`);
                this.showMultipleChoiceOptions(currentQ.options);
            }, 1600);
            this.lastPassageId = currentQ.passageId;
        } else {
            this.addMessage('bot', `**Question ${this.currentQuestionIndex + 1}:** ${currentQ.question}`);
            this.showMultipleChoiceOptions(currentQ.options);
        }

        this.updateQuestionProgress();
    }

    showMultipleChoiceOptions(options) {
        console.log('Showing options:', options); // Debug log
        
        if (!options || !Array.isArray(options)) {
            console.error('No options available for question');
            return;
        }

        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        optionsContainer.classList.remove('hidden');

        options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'answer-option';
            optionBtn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionBtn.addEventListener('click', () => {
                this.selectOption(optionBtn, index);
            });
            optionsContainer.appendChild(optionBtn);
        });

        // Hide text input since all questions are multiple choice
        document.getElementById('chat-input').style.display = 'none';
        document.getElementById('send-btn').style.display = 'none';
    }

    selectOption(selectedBtn, index) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Mark selected
        selectedBtn.classList.add('selected');
        
        // Auto-submit after selection
        setTimeout(() => {
            this.handleMultipleChoiceAnswer(index);
        }, 500);
    }

    handleMultipleChoiceAnswer(selectedIndex) {
        let question, isCorrect;
        
        if (this.currentTopic === 'reading-comprehension' && this.readingQuestions) {
            question = this.readingQuestions[this.currentQuestionIndex];
            isCorrect = selectedIndex === question.correct;
        } else {
            question = this.questions[this.currentQuestionIndex];
            isCorrect = selectedIndex === question.correct;
        }
        
        // Hide options
        document.getElementById('answer-options').classList.add('hidden');
        
        // Show user's answer
        const selectedOption = question.options[selectedIndex];
        this.addMessage('user', `${String.fromCharCode(65 + selectedIndex)}. ${selectedOption}`);
        
        // Store answer
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: selectedIndex,
            correct: isCorrect
        });

        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        setTimeout(() => {
            this.showAnswerFeedback(question, isCorrect);
        }, 500);
    }

    handleUserInput() {
        const input = document.getElementById('chat-input');
        const userAnswer = input.value.trim();
        
        if (!userAnswer) return;

        // Show user message
        this.addMessage('user', userAnswer);
        input.value = '';

        // Check if we're in review mode waiting for input
        if (this.currentMode === 'review' && this.waitingForMoreInput) {
            this.handleReviewInput(userAnswer);
            return;
        }

        // Regular question handling for practice/mock exam modes
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.checkTextAnswer(userAnswer, question.answer);
        
        // Store answer
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: userAnswer,
            correct: isCorrect
        });

        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        setTimeout(() => {
            this.showAnswerFeedback(question, isCorrect);
        }, 500);
    }

    checkTextAnswer(userAnswer, correctAnswer) {
        const normalize = (str) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
        return normalize(userAnswer) === normalize(correctAnswer);
    }

    showAnswerFeedback(question, isCorrect) {
        const feedback = isCorrect ? 
            `✅ Correct! ${question.explanation}` : 
            `❌ Not quite right. ${question.explanation}`;
        
        this.addMessage('bot', feedback);

        // Show next button or finish button
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                document.getElementById('next-btn').classList.remove('hidden');
            } else {
                document.getElementById('finish-btn').classList.remove('hidden');
            }
        }, 1000);
    }

    nextQuestion() {
        // Hide control buttons
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('finish-btn').classList.add('hidden');

        if (this.currentMode === 'review') {
            this.currentLessonIndex++;
            setTimeout(() => {
                this.showCurrentLesson();
            }, 500);
        } else {
            this.currentQuestionIndex++;
            setTimeout(() => {
                this.showCurrentQuestion();
            }, 500);
        }
    }

    showCurrentLesson() {
        console.log('showCurrentLesson called - lessons:', this.lessons.length, 'current index:', this.currentLessonIndex);
        
        if (this.currentLessonIndex >= this.lessons.length) {
            this.finishReviewSession();
            return;
        }

        const lesson = this.lessons[this.currentLessonIndex];
        console.log('Current lesson:', lesson);
        
        // Initialize lesson state for auto-flow
        this.currentConceptIndex = 0;
        this.currentLesson = lesson;
        this.waitingForMoreInput = false;
        this.autoFlowPaused = false;
        this.userProgress = { correct: 0, total: 0 };
        
        // Start auto-flow immediately
        this.startAutoFlowLesson();
        this.updateQuestionProgress();
    }

    startAutoFlowLesson() {
        const lesson = this.currentLesson;
        
        // Engaging opening with immediate value
        this.addMessage('bot', `📚 Let's master ${lesson.title}!`);
        
        setTimeout(() => {
            this.addMessage('bot', this.getEngagingHook(lesson.title));
        }, 800);
        
        setTimeout(() => {
            this.addMessage('bot', "Here we go... 🚀");
        }, 1600);
        
        setTimeout(() => {
            this.startAutoFlowConcepts();
        }, 2400);
    }

    getEngagingHook(lessonTitle) {
        const hooks = {
            "Grammar Fundamentals": "🎯 This appears in 70% of exams - master it in 3 minutes!",
            "Word Analogies Fundamentals": "🧩 The 3-step method that makes any analogy easy!",
            "Basic Operations and PEMDAS": "🔢 Never make calculation mistakes again!",
            "Philippine Constitution Fundamentals": "🏛️ Free points if you know these key facts!",
            "Peace and Human Rights": "🕊️ Connect the dots between history, law, and current events!",
            "Environment Management and Protection": "🌱 Essential laws every civil servant should know!",
            "Reading Strategies for Civil Service Exams": "📖 Read faster and understand better!",
            "Civil Service Commission (CSC)": "📋 Inside knowledge of how the system works!"
        };
        
        return hooks[lessonTitle] || `🎓 Essential knowledge that appears frequently in exams!`;
    }

    startAutoFlowConcepts() {
        this.currentConceptIndex = 0;
        this.showAutoFlowConcept();
    }

    showAutoFlowConcept() {
        const lesson = this.currentLesson;
        
        if (this.currentConceptIndex >= lesson.points.length) {
            this.showAutoFlowPractice();
            return;
        }

        const concept = lesson.points[this.currentConceptIndex];
        const conceptNumber = this.currentConceptIndex + 1;
        
        // Show comprehensive explanation (Message 1)
        const explanation = this.getDetailedConceptExplanation(concept, conceptNumber);
        this.addMessage('bot', explanation);
        
        setTimeout(() => {
            // Show exam strategy (Message 2)
            const examStrategy = this.getExamStrategy(concept);
            this.addMessage('bot', examStrategy);
        }, 2500);
        
        // Show control buttons after first concept
        if (this.currentConceptIndex === 0) {
            setTimeout(() => {
                this.showAutoFlowControls();
            }, 4000);
        }
        
        // Auto-advance to next concept
        setTimeout(() => {
            this.currentConceptIndex++;
            this.showAutoFlowConcept();
        }, 6000);
    }

    simplifyConceptText(concept) {
        // Remove formatting and make more conversational
        let simplified = concept.replace(/\*\*/g, '').replace(/🔢|📊|⚖️|🎯|📝|🔤|📖|✏️|🏛️|🌊|👨‍⚕️|📅|🕊️|👥|🤝|🛡️|🌱|🏭|💧|♻️|🌿|📋|⚙️|👥|📊|🎯|📜|🔗|📝|🔍|⚡|👥|↔️|🏗️|⚙️|📊/g, '');
        
        // Make it more direct and actionable
        if (simplified.includes('Subject-Verb Agreement')) {
            return 'Subject-Verb Agreement: ONE thing = IS, MANY things = ARE';
        }
        if (simplified.includes('PEMDAS')) {
            return 'PEMDAS Order: Parentheses → Exponents → Multiply/Divide → Add/Subtract';
        }
        if (simplified.includes('Word analogy')) {
            return 'Word Analogies: Find the relationship in first pair, apply to second pair';
        }
        if (simplified.includes('Executive Branch')) {
            return 'Executive Branch: President implements laws and runs government';
        }
        if (simplified.includes('Merit and fitness')) {
            return 'Merit System: Government jobs go to most qualified, not connections';
        }
        if (simplified.includes('Clean Air Act')) {
            return 'Environmental Laws: RA 8749 (Air), RA 9275 (Water), RA 9003 (Waste)';
        }
        
        return simplified.substring(0, 80) + (simplified.length > 80 ? '...' : '');
    }

    getQuickExample(concept) {
        if (concept.includes('Subject-Verb Agreement')) {
            return "📝 **Example:** 'The team IS playing' ✅ (team = one group) vs 'The players ARE playing' ✅ (players = many people)";
        }
        if (concept.includes('PEMDAS')) {
            return "📝 **Example:** 2 + 3 × 4 = 2 + 12 = 14 (multiply first: 3×4=12, then add: 2+12=14)";
        }
        if (concept.includes('Word analogy')) {
            return "📝 **Example:** BOOK:LIBRARY::MEDICINE:PHARMACY (both stored in their respective places)";
        }
        if (concept.includes('Executive Branch')) {
            return "📝 **Example:** President signs laws, appoints Cabinet members, commands military";
        }
        if (concept.includes('Merit and fitness')) {
            return "📝 **Example:** Hire based on exam scores and qualifications, not who you know";
        }
        if (concept.includes('Clean Air Act')) {
            return "📝 **Example:** RA 8749 controls vehicle emissions and factory smoke pollution";
        }
        return null;
    }

    getQuickTip(concept) {
        if (concept.includes('Subject-Verb Agreement')) {
            return "💡 **Quick Tip:** When in doubt, ask 'Is it one thing or many things?'";
        }
        if (concept.includes('PEMDAS')) {
            return "💡 **Quick Tip:** Remember 'Please Excuse My Dear Aunt Sally'";
        }
        if (concept.includes('Word analogy')) {
            return "💡 **Quick Tip:** Make a sentence with the first pair, then apply same relationship";
        }
        if (concept.includes('Executive Branch')) {
            return "💡 **Quick Tip:** Executive = Executes (carries out) the laws";
        }
        if (concept.includes('Merit and fitness')) {
            return "💡 **Quick Tip:** Merit = Best qualified person gets the job";
        }
        return null;
    }

    showAutoFlowControls() {
        const controlsHtml = `
            <div class="auto-flow-controls">
                <button id="more-details-btn" class="control-btn">📖 More Details</button>
                <button id="skip-to-practice-btn" class="control-btn">🎯 Skip to Practice</button>
            </div>
        `;
        
        const messagesContainer = document.getElementById('chat-messages');
        const controlsDiv = document.createElement('div');
        controlsDiv.innerHTML = controlsHtml;
        messagesContainer.appendChild(controlsDiv);
        
        // Add event listeners
        document.getElementById('more-details-btn').addEventListener('click', () => this.showMoreDetails());
        document.getElementById('skip-to-practice-btn').addEventListener('click', () => this.skipToPractice());
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    pauseAutoFlow() {
        this.autoFlowPaused = !this.autoFlowPaused;
        const pauseBtn = document.getElementById('pause-btn');
        
        if (this.autoFlowPaused) {
            pauseBtn.textContent = '▶️ Continue';
            this.addMessage('bot', "⏸️ Paused. Click Continue when ready, or use the other buttons for more options.");
        } else {
            pauseBtn.textContent = '⏸️ Pause';
            this.addMessage('bot', "▶️ Continuing...");
            setTimeout(() => {
                this.currentConceptIndex++;
                this.showAutoFlowConcept();
            }, 1000);
        }
    }

    showMoreDetails() {
        const lesson = this.currentLesson;
        const concept = lesson.points[this.currentConceptIndex];
        const details = this.getDetailedExplanation(concept);
        
        this.addMessage('bot', details);
        this.addMessage('bot', "Auto-flow will continue in 5 seconds, or click Pause to stop.");
        
        if (!this.autoFlowPaused) {
            setTimeout(() => {
                this.currentConceptIndex++;
                this.showAutoFlowConcept();
            }, 5000);
        }
    }

    skipToPractice() {
        this.addMessage('bot', "🎯 Jumping to practice questions...");
        
        setTimeout(() => {
            this.showAutoFlowPractice();
        }, 1000);
    }

    getDetailedConceptExplanation(concept, conceptNumber) {
        if (concept.includes('Executive Branch')) {
            return `📚 **Concept ${conceptNumber}: Executive Branch - The Government's Action Team**

The Executive Branch is like the management team of Philippines Inc! 🏛️

**What they actually do:**
• **Implement laws** - Turn Congress's written laws into real programs and services
• **Run daily government** - Manage all departments (health, education, defense, finance)
• **Make executive decisions** - Handle crises, foreign relations, emergency responses
• **Appoint key officials** - Choose Cabinet members, ambassadors, military leaders

**Real-world example:**
When Congress passes a law saying "provide free healthcare to senior citizens," the Executive Branch (Department of Health) actually:
- Creates the PhilHealth programs
- Builds health centers  
- Trains doctors and nurses
- Distributes medicines
- Handles the day-to-day operations

**Key players:**
President (CEO), Vice President (backup CEO), Cabinet Secretaries (department heads)`;
        }

        if (concept.includes('Legislative Branch')) {
            return `📚 **Concept ${conceptNumber}: Legislative Branch - The Law-Making Factory**

Think of Congress as the "rule-making committee" for the entire Philippines! 🏛️

**What they actually do:**
• **Create laws** - Write, debate, and pass bills that become national laws
• **Control the budget** - Decide how government money is spent (power of the purse)
• **Investigate issues** - Hold hearings on corruption, disasters, public problems
• **Represent the people** - Senators represent entire Philippines, Representatives represent districts

**Two chambers working together:**
- **Senate (24 members)** - Elected nationwide, 6-year terms, "upper house"
- **House of Representatives (300+ members)** - Elected by district, 3-year terms, "lower house"

**Real-world example:**
When there's a problem like expensive rice, Congress:
- Investigates why prices are high
- Writes a law to control rice imports
- Allocates budget for rice subsidies
- Monitors if the law is working`;
        }

        if (concept.includes('Judicial Branch')) {
            return `📚 **Concept ${conceptNumber}: Judicial Branch - The Referees of Government**

The courts are like referees in a basketball game - they make sure everyone follows the rules! ⚖️

**What they actually do:**
• **Interpret laws** - Decide what laws mean when there's confusion or conflict
• **Settle disputes** - Resolve conflicts between people, companies, or government agencies
• **Check constitutionality** - Determine if laws or actions violate the Constitution
• **Protect rights** - Ensure citizens' constitutional rights are respected

**Court hierarchy (like a ladder):**
- **Supreme Court (15 justices)** - Highest court, final decisions, constitutional issues
- **Court of Appeals** - Reviews lower court decisions
- **Regional Trial Courts** - Handle serious criminal and civil cases
- **Municipal/City Courts** - Handle minor cases and local disputes

**Real-world example:**
If a new law says "no protests allowed," someone can challenge it in court. The Judicial Branch will decide if this law violates the Constitution's guarantee of free speech.`;
        }

        if (concept.includes('Subject-Verb Agreement')) {
            return `📚 **Concept ${conceptNumber}: Subject-Verb Agreement - The Grammar Rule That Wins Points**

This is the #1 grammar mistake that costs test-takers easy points! 📝

**The simple rule:**
• **ONE thing** = use IS, HAS, DOES, WAS
• **MANY things** = use ARE, HAVE, DO, WERE

**The tricky part - Collective nouns:**
Words like TEAM, GOVERNMENT, COMMITTEE, FAMILY look like "many people" but they're treated as ONE unit:
- The team IS playing (one team)
- The government IS working (one government)  
- The committee HAS decided (one committee)

**Common mistakes to avoid:**
❌ "The team are winning" → ✅ "The team IS winning"
❌ "The government are planning" → ✅ "The government IS planning"
❌ "The staff are meeting" → ✅ "The staff IS meeting"

**Special cases:**
- THE PHILIPPINES (country name) = singular → "The Philippines IS beautiful"
- PEOPLE = always plural → "The people ARE voting"`;
        }

        if (concept.includes('PEMDAS')) {
            return `📚 **Concept ${conceptNumber}: PEMDAS - The Math Order That Prevents Mistakes**

PEMDAS isn't just a random order - it's like following a recipe! If you mix ingredients in wrong order, your cake fails. Same with math! 🔢

**The correct order (PEMDAS):**
1. **P**arentheses ( ) - Do what's inside parentheses first
2. **E**xponents ^2 - Handle powers and square roots  
3. **M**ultiplication × and **D**ivision ÷ - Left to right
4. **A**ddition + and **S**ubtraction - - Left to right

**Memory trick:**
"Please Excuse My Dear Aunt Sally"

**Why this matters:**
Most people calculate left to right like reading: 2 + 3 × 4 = 5 × 4 = 20 ❌
But math rules say: 2 + 3 × 4 = 2 + 12 = 14 ✅

**Real example from government work:**
Budget calculation: Base salary + (overtime hours × hourly rate)
₱20,000 + (10 × ₱500) = ₱20,000 + ₱5,000 = ₱25,000
NOT: (₱20,000 + 10) × ₱500 = ₱10,005,000 (wrong!)`;
        }

        if (concept.includes('Word analogy')) {
            return `📚 **Concept ${conceptNumber}: Word Analogies - The Pattern Recognition Game**

Word analogies are like solving puzzles - once you see the pattern, they become easy! 🧩

**The secret formula:**
1. **Find the relationship** in the first pair
2. **Make a sentence** connecting them  
3. **Apply the same relationship** to find the answer

**Common relationship types:**
• **Function:** PEN:WRITE (pen is used to write)
• **Location:** BOOK:LIBRARY (books are stored in libraries)
• **Part-to-whole:** WHEEL:CAR (wheel is part of a car)
• **Synonyms:** HAPPY:JOYFUL (both mean the same)
• **Antonyms:** HOT:COLD (opposites)
• **Degree:** WARM:HOT (different intensities)

**Step-by-step example:**
DOCTOR:HOSPITAL::TEACHER:?
1. Relationship: "Doctor works in hospital"
2. Apply same: "Teacher works in ___"
3. Answer: SCHOOL

**Pro tip:**
Always make your sentence specific enough that it only works one way!`;
        }

        // Default explanation for other concepts
        return `📚 **Concept ${conceptNumber}: ${this.extractConceptTitle(concept)}**

${concept.replace(/\*\*/g, '').replace(/🔢|📊|⚖️|🎯|📝|🔤|📖|✏️|🏛️|🌊|👨‍⚕️|📅|🕊️|👥|🤝|🛡️|🌱|🏭|💧|♻️|🌿|📋|⚙️|👥|📊|🎯|📜|🔗|📝|🔍|⚡|👥|↔️|🏗️|⚙️|📊/g, '')}

This concept is essential for civil service success because it appears frequently in examinations and helps you understand how government systems work in practice.`;
    }

    getExamStrategy(concept) {
        if (concept.includes('Executive Branch')) {
            return `🎯 **Exam Strategy - Executive Branch**

**Why this matters for your exam:**
Appears in 8 out of 10 Constitutional Law questions!

**Common exam questions:**
• "Who implements the laws?" → **Executive Branch** ✅
• "Who appoints Cabinet members?" → **President** ✅  
• "Who commands the military?" → **President** (as Commander-in-Chief) ✅
• "Can the President make laws?" → **NO** (only Congress can) ❌

**Memory tricks for the exam:**
• Executive = Execute = DO the work (like a company executive)
• President = CEO of Philippines Inc.
• Cabinet = President's management team

**Tricky exam questions to watch for:**
❌ "President makes laws" → NO! President signs/vetoes laws made by Congress
❌ "President controls Supreme Court" → NO! President appoints, but can't control decisions
✅ "President enforces laws" → YES! That's the main job

**Quick exam facts:**
• Presidential term: 6 years, NO re-election
• Age requirement: 40+ years old (not 35 like in US)
• Powers listed in: Article VII of Constitution`;
        }

        if (concept.includes('Legislative Branch')) {
            return `🎯 **Exam Strategy - Legislative Branch**

**Why this matters for your exam:**
70% of Constitutional Law questions test legislative powers!

**Common exam questions:**
• "Who makes the laws?" → **Congress (Legislative Branch)** ✅
• "Who controls government spending?" → **Congress (power of the purse)** ✅
• "How many senators?" → **24 senators** ✅
• "Senate term?" → **6 years** ✅
• "House term?" → **3 years** ✅

**Memory tricks for the exam:**
• Legislative = Legislate = Make LAWS
• Senate = 24 members, 6 years (both have 2 and 6)
• House = 3 years (House has 3 letters in "Rep")

**Exam trap questions:**
❌ "Senate has 12 members" → NO! It's 24
❌ "Senators serve 3 years" → NO! It's 6 years  
❌ "President can dissolve Congress" → NO! Separation of powers
✅ "Congress can override presidential veto" → YES! With 2/3 vote

**Quick exam facts:**
• Total Congress members: 24 Senate + 300+ House
• Both chambers must pass a bill to become law
• Congress controls: budget, taxes, declaring war`;
        }

        if (concept.includes('Subject-Verb Agreement')) {
            return `🎯 **Exam Strategy - Subject-Verb Agreement**

**Why this matters for your exam:**
Appears in 90% of English/Verbal Ability tests!

**Common exam questions:**
• "The team ___ playing well." → **IS** ✅ (team = one unit)
• "The government ___ working hard." → **IS** ✅ (government = one entity)
• "The Philippines ___ a beautiful country." → **IS** ✅ (country name = singular)
• "The people ___ voting today." → **ARE** ✅ (people = always plural)

**Exam shortcuts:**
• Collective nouns (team, government, committee, family) = **IS**
• Country names (Philippines, United States) = **IS**  
• "People" = always **ARE**
• "Data" = can be **IS** or **ARE** (both accepted)

**Instant exam wins:**
✅ The Civil Service Commission IS responsible...
✅ The Department of Education HAS announced...
✅ The Supreme Court WAS established...
❌ The team ARE winning (common wrong answer)

**Pro exam tip:**
When in doubt, ask "Is this ONE thing or MANY things?" ONE = IS, MANY = ARE`;
        }

        if (concept.includes('PEMDAS')) {
            return `🎯 **Exam Strategy - PEMDAS**

**Why this matters for your exam:**
80% of numerical ability questions test order of operations!

**Common exam questions:**
• "8 + 2 × 3 = ?" → **14** ✅ (not 30!)
• "20 - 4 × 3 + 2 = ?" → **10** ✅ (multiply first: 20 - 12 + 2)
• "(5 + 3) × 2 = ?" → **16** ✅ (parentheses first: 8 × 2)

**Exam shortcuts:**
• See multiplication/division? Do them BEFORE addition/subtraction
• See parentheses? Do them FIRST, always
• Same level operations? Go left to right

**Instant point-winners:**
✅ 2 + 3 × 4 = 2 + 12 = 14
✅ 10 ÷ 2 + 3 = 5 + 3 = 8  
✅ (6 + 4) ÷ 2 = 10 ÷ 2 = 5
❌ 2 + 3 × 4 = 5 × 4 = 20 (common wrong answer)

**Pro exam tip:**
When you see mixed operations, circle the multiplication and division first, solve them, then do addition and subtraction left to right.`;
        }

        if (concept.includes('Word analogy')) {
            return `🎯 **Exam Strategy - Word Analogies**

**Why this matters for your exam:**
Appears in 100% of Professional Level Analytical Ability tests!

**Common exam question types:**
• BOOK:LIBRARY::MEDICINE:? → **PHARMACY** ✅ (storage location)
• PEN:WRITE::KNIFE:? → **CUT** ✅ (function/purpose)  
• HAPPY:ECSTATIC::WARM:? → **HOT** ✅ (degree/intensity)
• TEACHER:STUDENT::DOCTOR:? → **PATIENT** ✅ (professional relationship)

**Exam shortcuts:**
• Make a sentence with first pair: "Books are stored in libraries"
• Apply to second pair: "Medicines are stored in ___"
• Answer: PHARMACY

**Instant point-winners:**
✅ Always identify the relationship first
✅ Make your sentence specific and clear
✅ Test your answer by making the same sentence
❌ Don't just look for similar words

**Pro exam tip:**
The most common relationships are: function, location, part-to-whole, synonyms, antonyms, and degree. Learn to spot these patterns quickly!`;
        }

        // Default exam strategy
        return `**🎯 Exam Strategy**

This concept frequently appears in civil service examinations. Understanding it thoroughly will help you:
• Answer related questions confidently
• Apply the knowledge to practical scenarios  
• Connect it with other related topics
• Demonstrate comprehensive understanding

**Key exam tip:** Practice applying this concept in different contexts to master it completely.`;
    }

    extractConceptTitle(concept) {
        // Extract a clean title from the concept text
        const match = concept.match(/\*\*(.*?)\*\*/);
        if (match) {
            return match[1].replace(/:/g, '');
        }
        return concept.substring(0, 50).replace(/\*\*/g, '').replace(/🔢|📊|⚖️|🎯|📝|🔤|📖|✏️|🏛️|🌊|👨‍⚕️|📅|🕊️|👥|🤝|🛡️|🌱|🏭|💧|♻️|🌿|📋|⚙️|👥|📊|🎯|📜|🔗|📝|🔍|⚡|👥|↔️|🏗️|⚙️|📊/g, '');
    }

    showAutoFlowPractice() {
        this.addMessage('bot', "💪 Time for quick practice to lock in your learning!");
        
        setTimeout(() => {
            this.practiceQuestions = this.generatePracticeQuestions();
            this.currentPracticeIndex = 0;
            
            if (this.practiceQuestions.length > 0) {
                this.addMessage('bot', "I'll give you a few quick questions. Just click your answer - no typing needed! 😊");
                setTimeout(() => {
                    this.showPracticeQuestion();
                }, 1200);
            } else {
                this.showLessonSummary();
            }
        }, 1200);
    }

    showLessonHook() {
        const lesson = this.currentLesson;
        const hooks = this.getLessonHook(lesson.title);
        
        this.addMessage('bot', hooks.opening);
        
        setTimeout(() => {
            this.addMessage('bot', hooks.question);
        }, 1200);
        
        setTimeout(() => {
            this.addMessage('bot', hooks.promise);
        }, 2400);
        
        setTimeout(() => {
            this.addMessage('bot', "Ready to dive in? Type 'Yes' to start learning, or 'Skip' to jump to practice questions.");
            this.waitingForMoreInput = true;
            this.showInputControls();
        }, 3600);
    }

    getLessonHook(lessonTitle) {
        const hooks = {
            "Grammar Fundamentals": {
                opening: "🎯 Did you know that 65% of test-takers lose points on grammar questions that are actually quite easy?",
                question: "Have you ever been confused about when to use 'IS' vs 'ARE'? Or mixed up 'their' and 'there'? 🤔",
                promise: "In the next few minutes, I'll teach you the simple tricks that grammar experts use to get these right every time! 🚀"
            },
            "Word Analogies Fundamentals": {
                opening: "🧩 Word analogies appear in 80% of Professional Level exams - and they're actually easier than they look!",
                question: "Ever seen 'BOOK:LIBRARY::MEDICINE:?' and felt confused? 😅",
                promise: "I'll show you the 3-step method that makes any analogy crystal clear. You'll be solving these in seconds! ⚡"
            },
            "Basic Operations and PEMDAS": {
                opening: "🔢 Here's a shocking fact: Most people get 8 + 2 × 3 wrong on their first try!",
                question: "What do you think the answer is? 30 or 14? 🤨",
                promise: "I'll teach you the PEMDAS trick that ensures you never make calculation mistakes again! 🎯"
            },
            "Philippine Constitution Fundamentals": {
                opening: "🏛️ The 1987 Constitution questions are actually FREE POINTS if you know the key facts!",
                question: "Did you know there's a simple pattern to remember all the important dates and numbers? 📅",
                promise: "I'll share the memory tricks that law students use to ace constitutional law! 💡"
            },
            "Peace and Human Rights": {
                opening: "🕊️ Peace and Human Rights questions often stump test-takers, but they follow predictable patterns!",
                question: "Ever wondered why the Philippines has so many peace processes? 🤝",
                promise: "I'll connect the dots between history, law, and current events to make this topic crystal clear! 🌟"
            }
        };
        
        return hooks[lessonTitle] || {
            opening: `🎓 Let's master ${lessonTitle} - this topic appears frequently in civil service exams!`,
            question: "Ready to learn the insider secrets that top scorers use? 🚀",
            promise: "I'll break this down into simple, memorable concepts that you'll never forget! 💪"
        };
    }

    handleReviewInput(userInput) {
        const input = userInput.toLowerCase().trim();
        
        if (this.lessonPhase === 'hook') {
            if (input === 'yes' || input === 'y') {
                this.lessonPhase = 'explain';
                this.hideInputControls();
                setTimeout(() => this.startConversationalExplanation(), 500);
            } else if (input === 'skip' || input === 's') {
                this.lessonPhase = 'practice';
                this.hideInputControls();
                setTimeout(() => this.startInteractivePractice(), 500);
            } else {
                this.addMessage('bot', "Just type 'Yes' to learn step-by-step, or 'Skip' to jump to practice! 😊");
            }
        } else if (this.lessonPhase === 'explain') {
            this.handleExplanationInput(input);
        } else if (this.lessonPhase === 'practice') {
            this.handlePracticeInput(input);
        }
    }

    startConversationalExplanation() {
        const lesson = this.currentLesson;
        this.currentConceptIndex = 0;
        
        this.addMessage('bot', "Perfect! Let's start with the basics... 📚");
        
        setTimeout(() => {
            this.explainConceptConversationally();
        }, 800);
    }

    explainConceptConversationally() {
        const lesson = this.currentLesson;
        
        if (this.currentConceptIndex >= lesson.points.length) {
            this.moveToInteractivePractice();
            return;
        }

        const concept = lesson.points[this.currentConceptIndex];
        const explanation = this.getConversationalExplanation(concept);
        
        this.addMessage('bot', explanation.setup);
        
        setTimeout(() => {
            this.addMessage('bot', explanation.explanation);
        }, 1200);
        
        setTimeout(() => {
            this.addMessage('bot', explanation.example);
        }, 2400);
        
        setTimeout(() => {
            this.addMessage('bot', explanation.check);
            this.waitingForMoreInput = true;
            this.showInputControls();
        }, 3600);
    }

    getConversationalExplanation(concept) {
        if (concept.includes('Subject-Verb Agreement')) {
            return {
                setup: "Let's talk about something that trips up even native speakers... 🤔",
                explanation: "Think of it like counting: ONE thing uses 'IS', MANY things use 'ARE'. Simple, right? The tricky part is recognizing what counts as 'one' vs 'many'.",
                example: "For example: 'The TEAM is playing' (one team) vs 'The PLAYERS are playing' (many players). The team might have 11 players, but it's still ONE team! ⚽",
                check: "Does this make sense? Type 'Yes' if you get it, or 'More' if you want another example! 😊"
            };
        }
        
        if (concept.includes('PEMDAS')) {
            return {
                setup: "Here's the secret that math teachers don't always explain clearly... 🔢",
                explanation: "PEMDAS isn't just a random order - it's like following a recipe! You MUST do ingredients in the right order, or your cake will be ruined. Same with math!",
                example: "Try this: 2 + 3 × 4. Most people think '2 + 3 = 5, then 5 × 4 = 20'. WRONG! It's '3 × 4 = 12, then 2 + 12 = 14'. Multiplication comes before addition! 🎯",
                check: "Make sense? Type 'Yes' if you've got it, or 'Practice' to try one yourself! 💪"
            };
        }
        
        if (concept.includes('Word analogy')) {
            return {
                setup: "Word analogies seem scary, but they're actually like solving puzzles... 🧩",
                explanation: "The secret is to make a sentence with the first pair, then use the SAME relationship for the second pair. It's like finding the pattern!",
                example: "BOOK:LIBRARY - 'Books are stored in libraries.' So MEDICINE:? - 'Medicines are stored in...' PHARMACIES! The relationship is 'item stored in location'. 💡",
                check: "See the pattern? Type 'Yes' if this clicks, or 'Another' for a different example! 🎯"
            };
        }
        
        // Default conversational explanation
        return {
            setup: "Let me break this down in a way that's easy to remember... 💡",
            explanation: concept.replace(/\*\*/g, '').replace(/🔢|📊|⚖️|🎯/g, ''),
            example: "Here's how this works in real life: " + (this.getConceptExample(concept) || "This concept helps you understand the bigger picture."),
            check: "Does this make sense to you? Type 'Yes' to continue or 'More' for additional explanation! 😊"
        };
    }

    handleExplanationInput(input) {
        if (input === 'yes' || input === 'y') {
            this.currentConceptIndex++;
            this.hideInputControls();
            setTimeout(() => this.explainConceptConversationally(), 500);
        } else if (input === 'more' || input === 'm' || input === 'another') {
            this.hideInputControls();
            this.showAdditionalExplanation();
        } else if (input === 'practice' || input === 'p') {
            this.lessonPhase = 'practice';
            this.hideInputControls();
            setTimeout(() => this.startInteractivePractice(), 500);
        } else {
            this.addMessage('bot', "Just type 'Yes' to continue, 'More' for extra explanation, or 'Practice' to try some questions! 😊");
        }
    }

    showAdditionalExplanation() {
        const lesson = this.currentLesson;
        const concept = lesson.points[this.currentConceptIndex];
        const additional = this.getDetailedExplanation(concept);
        
        this.addMessage('bot', additional);
        
        setTimeout(() => {
            this.addMessage('bot', "Got it now? Type 'Yes' to move on, or 'Practice' to try some questions! 🎯");
            this.waitingForMoreInput = true;
            this.showInputControls();
        }, 1500);
    }

    moveToInteractivePractice() {
        this.lessonPhase = 'practice';
        this.addMessage('bot', "Awesome! You've learned the concepts. Now let's practice to make sure you've really got this! 💪");
        
        setTimeout(() => {
            this.addMessage('bot', "I'll give you some quick questions. Don't worry - I'll help you if you get stuck! 😊");
        }, 1200);
        
        setTimeout(() => {
            this.startInteractivePractice();
        }, 2400);
    }

    startInteractivePractice() {
        // Create simple practice questions based on the lesson
        this.practiceQuestions = this.generatePracticeQuestions();
        this.currentPracticeIndex = 0;
        
        if (this.practiceQuestions.length > 0) {
            this.showPracticeQuestion();
        } else {
            this.showLessonSummary();
        }
    }

    generatePracticeQuestions() {
        const lesson = this.currentLesson;
        
        if (lesson.title.includes('Grammar')) {
            return [
                {
                    question: "Quick check! Which is correct?",
                    options: ["The team are winning", "The team is winning"],
                    correct: 1,
                    explanation: "Perfect! 'Team' is one group, so we use 'is'. You've got this! 🎉"
                },
                {
                    question: "One more! Choose the right one:",
                    options: ["The students is studying", "The students are studying"],
                    correct: 1,
                    explanation: "Excellent! 'Students' is plural (many), so we use 'are'. You're mastering this! ⭐"
                }
            ];
        }
        
        if (lesson.title.includes('PEMDAS')) {
            return [
                {
                    question: "Let's try one: What's 5 + 2 × 3?",
                    options: ["21", "11"],
                    correct: 1,
                    explanation: "Yes! Multiplication first: 2 × 3 = 6, then 5 + 6 = 11. You've got PEMDAS! 🎯"
                }
            ];
        }
        
        if (lesson.title.includes('Word Analogies')) {
            return [
                {
                    question: "Try this analogy: PEN:WRITE::KNIFE:?",
                    options: ["Sharp", "Cut", "Kitchen", "Metal"],
                    correct: 1,
                    explanation: "Brilliant! Pen is used to write, knife is used to cut. You found the function relationship! 🧩"
                }
            ];
        }
        
        return []; // No practice questions for this lesson type
    }

    showPracticeQuestion() {
        if (this.currentPracticeIndex >= this.practiceQuestions.length) {
            this.showMasteryCheck();
            return;
        }
        
        const question = this.practiceQuestions[this.currentPracticeIndex];
        
        this.addMessage('bot', question.question);
        
        setTimeout(() => {
            this.showPracticeOptions(question.options);
        }, 800);
    }

    showPracticeOptions(options) {
        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        optionsContainer.classList.remove('hidden');

        options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'answer-option';
            optionBtn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionBtn.addEventListener('click', () => {
                this.handlePracticeAnswer(index);
            });
            optionsContainer.appendChild(optionBtn);
        });
    }

    handlePracticeAnswer(selectedIndex) {
        const question = this.practiceQuestions[this.currentPracticeIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Hide options
        document.getElementById('answer-options').classList.add('hidden');
        
        // Show user's answer
        const selectedOption = question.options[selectedIndex];
        this.addMessage('user', `${String.fromCharCode(65 + selectedIndex)}. ${selectedOption}`);
        
        // Update progress
        this.userProgress.total++;
        if (isCorrect) {
            this.userProgress.correct++;
        }
        
        // Show feedback
        setTimeout(() => {
            if (isCorrect) {
                this.addMessage('bot', question.explanation);
            } else {
                this.addMessage('bot', `Not quite! The correct answer is ${String.fromCharCode(65 + question.correct)}. ${question.explanation}`);
            }
            
            this.currentPracticeIndex++;
            
            setTimeout(() => {
                this.showPracticeQuestion();
            }, 2000);
        }, 500);
    }

    showMasteryCheck() {
        const percentage = Math.round((this.userProgress.correct / this.userProgress.total) * 100);
        
        if (percentage >= 80) {
            this.addMessage('bot', `🎉 Outstanding! You scored ${percentage}% - you've mastered this concept!`);
            this.addMessage('bot', "You're ready for exam questions on this topic. Great job! 🌟");
        } else if (percentage >= 60) {
            this.addMessage('bot', `👍 Good work! You scored ${percentage}%. You understand the basics!`);
            this.addMessage('bot', "With a bit more practice, you'll have this down perfectly. Keep it up! 💪");
        } else {
            this.addMessage('bot', `📚 You scored ${percentage}%. No worries - this is how learning works!`);
            this.addMessage('bot', "Let me give you one more explanation to help it click... 🤔");
        }
        
        setTimeout(() => {
            this.showLessonSummary();
        }, 2000);
    }

    showInputControls() {
        document.getElementById('chat-input').style.display = 'block';
        document.getElementById('send-btn').style.display = 'block';
        document.getElementById('chat-input').placeholder = "Type your response...";
    }

    hideInputControls() {
        document.getElementById('chat-input').style.display = 'none';
        document.getElementById('send-btn').style.display = 'none';
        this.waitingForMoreInput = false;
    }

    showNextConcept() {
        const lesson = this.currentLesson;
        
        if (this.currentConceptIndex >= lesson.points.length) {
            // All concepts shown, show memory tip and example
            this.showLessonSummary();
            return;
        }

        const concept = lesson.points[this.currentConceptIndex];
        this.addMessage('bot', concept);
        
        // Add simple example for this concept if available
        const conceptExamples = this.getConceptExample(concept);
        if (conceptExamples) {
            setTimeout(() => {
                this.addMessage('bot', conceptExamples);
            }, 800);
        }
        
        setTimeout(() => {
            this.askForMoreDetails();
        }, conceptExamples ? 1600 : 800);
    }

    getConceptExample(concept) {
        // Extract simple examples based on concept content
        if (concept.includes('Subject-Verb Agreement')) {
            return "📝 **Example:** 'The student IS studying' (singular) vs 'The students ARE studying' (plural)";
        }
        if (concept.includes('PEMDAS')) {
            return "📝 **Example:** 2 + 3 × 4 = 2 + 12 = 14 (multiply first, then add)";
        }
        if (concept.includes('Arithmetic Series')) {
            return "📝 **Example:** 2, 5, 8, 11... (add 3 each time)";
        }
        if (concept.includes('Synonyms')) {
            return "📝 **Example:** HAPPY:JOYFUL (both mean the same thing)";
        }
        if (concept.includes('Executive Branch')) {
            return "📝 **Example:** President signs laws, appoints officials, commands military";
        }
        if (concept.includes('Merit and fitness')) {
            return "📝 **Example:** Hire based on exam scores and qualifications, not connections";
        }
        if (concept.includes('Clean Air Act')) {
            return "📝 **Example:** RA 8749 controls vehicle emissions and factory smoke";
        }
        if (concept.includes('Active Reading')) {
            return "📝 **Example:** Ask 'What is this about?' while reading each paragraph";
        }
        return null;
    }

    askForMoreDetails() {
        this.addMessage('bot', "Need more explanation or examples? Type 'Yes' for more details, or 'Next' to continue.");
        this.waitingForMoreInput = true;
        
        // Show input controls
        document.getElementById('chat-input').style.display = 'block';
        document.getElementById('send-btn').style.display = 'block';
        document.getElementById('chat-input').placeholder = "Type 'Yes' or 'Next'";
    }

    handleReviewInput(userInput) {
        const input = userInput.toLowerCase().trim();
        
        if (input === 'yes' || input === 'y') {
            this.showMoreDetails();
        } else if (input === 'next' || input === 'n') {
            this.moveToNextConcept();
        } else {
            this.addMessage('bot', "Please type 'Yes' for more details or 'Next' to continue.");
        }
    }

    showMoreDetails() {
        const lesson = this.currentLesson;
        const concept = lesson.points[this.currentConceptIndex];
        
        // Provide detailed explanation based on concept
        let details = this.getDetailedExplanation(concept);
        
        this.addMessage('bot', details);
        
        setTimeout(() => {
            this.addMessage('bot', "Ready to continue? Type 'Next' to move on.");
        }, 1000);
    }

    getDetailedExplanation(concept) {
        if (concept.includes('Subject-Verb Agreement')) {
            return "🔍 **More Details:** Singular subjects (one person/thing) use singular verbs (is, has, does). Plural subjects (multiple) use plural verbs (are, have, do). Collective nouns like 'team' are usually singular.";
        }
        if (concept.includes('PEMDAS')) {
            return "🔍 **More Details:** Remember the order: Parentheses ( ), Exponents ^, Multiplication ×, Division ÷, Addition +, Subtraction -. Operations of equal priority go left to right.";
        }
        if (concept.includes('Word analogy')) {
            return "🔍 **More Details:** First identify the relationship between the first pair, then find the same relationship in the answer choices. Common types: synonyms, antonyms, part-to-whole, function, degree.";
        }
        if (concept.includes('Executive Branch')) {
            return "🔍 **More Details:** The President is both Head of State and Head of Government. Powers include: executing laws, appointing officials, commanding armed forces, conducting foreign policy, granting pardons.";
        }
        if (concept.includes('Merit and fitness')) {
            return "🔍 **More Details:** This means government jobs go to the most qualified candidates through competitive exams and evaluations, not through political connections, family ties, or favoritism.";
        }
        return "🔍 **More Details:** This concept is fundamental to understanding the topic. Practice applying it in different scenarios to master it completely.";
    }

    moveToNextConcept() {
        this.currentConceptIndex++;
        this.waitingForMoreInput = false;
        
        // Hide input controls
        document.getElementById('chat-input').style.display = 'none';
        document.getElementById('send-btn').style.display = 'none';
        document.getElementById('chat-input').placeholder = "Type your answer...";
        
        setTimeout(() => {
            this.showNextConcept();
        }, 500);
    }

    showLessonSummary() {
        const lesson = this.currentLesson;
        
        // Show memory tip
        this.addMessage('bot', lesson.memory_tip);
        
        setTimeout(() => {
            // Show main example
            this.addMessage('bot', lesson.example);
        }, 800);
        
        setTimeout(() => {
            // Show lesson completion options
            if (this.currentLessonIndex < this.lessons.length - 1) {
                document.getElementById('next-btn').classList.remove('hidden');
                document.getElementById('next-btn').textContent = 'Next Lesson';
            } else {
                document.getElementById('finish-btn').classList.remove('hidden');
                document.getElementById('finish-btn').textContent = 'Finish Review';
            }
        }, 1600);
    }

    finishReviewSession() {
        this.addMessage('bot', `🎉 Great job! You've completed all ${this.lessons.length} lessons in ${this.data[this.currentTopic].name}.`);
        
        setTimeout(() => {
            this.addMessage('bot', "📝 **Study Tips:**\n• Review these concepts regularly\n• Try Practice Mode to test your knowledge\n• Take Mock Exams when you feel ready");
        }, 1000);
        
        setTimeout(() => {
            this.addMessage('bot', "Ready to test what you learned? Click 'Back' and try Practice Mode! 💪");
        }, 2000);
    }

    startTimer(minutes) {
        this.timeRemaining = minutes * 60; // Convert to seconds
        const timerDisplay = document.getElementById('timer-display');
        const timeElement = document.getElementById('time-remaining');
        
        timerDisplay.classList.remove('hidden');
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            const mins = Math.floor(this.timeRemaining / 60);
            const secs = this.timeRemaining % 60;
            timeElement.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            // Change color based on time remaining
            if (this.timeRemaining <= 300) { // 5 minutes
                timerDisplay.className = 'timer danger';
            } else if (this.timeRemaining <= 600) { // 10 minutes
                timerDisplay.className = 'timer warning';
            }
            
            // Auto-submit when time runs out
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        document.getElementById('timer-display').classList.add('hidden');
    }

    timeUp() {
        this.stopTimer();
        this.addMessage('bot', '⏰ Time\'s up! Your exam has been automatically submitted.');
        
        setTimeout(() => {
            this.finishSession();
        }, 1000);
    }

    finishSession() {
        // Stop timer if running
        this.stopTimer();
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const resultMessage = this.getResultMessage(percentage);
        
        this.addMessage('bot', resultMessage);
        
        // Show detailed breakdown for mock exams
        if (this.currentMode === 'mock-exam') {
            setTimeout(() => {
                const breakdown = this.getDetailedResults();
                this.addMessage('bot', breakdown);
            }, 1000);
        }
        
        // Save progress
        this.saveProgress();
        
        // Show back to home option
        setTimeout(() => {
            this.addMessage('bot', "Great job! Click 'Back' to return to the main menu and try another topic or mode. 🎉");
        }, 2000);
    }

    getDetailedResults() {
        const correct = this.userAnswers.filter(a => a.correct).length;
        const incorrect = this.userAnswers.length - correct;
        const percentage = Math.round((correct / this.userAnswers.length) * 100);
        
        let performance = '';
        if (percentage >= 80) performance = 'Excellent! 🌟';
        else if (percentage >= 70) performance = 'Good! 👍';
        else if (percentage >= 60) performance = 'Fair 📚';
        else performance = 'Need more practice 💪';
        
        return `📊 **Detailed Results:**
• Correct: ${correct}/${this.userAnswers.length}
• Accuracy: ${percentage}%
• Performance: ${performance}
• Topic: ${this.data[this.currentTopic].name}`;
    }

    getResultMessage(percentage) {
        const score = `You scored ${this.score}/${this.questions.length} (${percentage}%)`;
        
        if (percentage >= 80) {
            return `🎉 Excellent work! ${score}. You're well-prepared for this topic!`;
        } else if (percentage >= 60) {
            return `👍 Good job! ${score}. Keep practicing to improve further!`;
        } else {
            return `📚 ${score}. Don't worry - review the explanations and try again. Practice makes perfect!`;
        }
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // Convert line breaks to HTML and preserve formatting
        const formattedText = text
            .replace(/\n\n/g, '<br><br>')  // Double line breaks
            .replace(/\n/g, '<br>')        // Single line breaks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text
        
        bubble.innerHTML = formattedText;
        
        if (sender === 'bot') {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(bubble);
        } else {
            messageDiv.appendChild(bubble);
            messageDiv.appendChild(avatar);
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    saveProgress() {
        const progress = this.getStoredProgress();
        const topicKey = this.currentTopic;
        
        if (!progress[topicKey]) {
            progress[topicKey] = { completed: 0, total: 0 };
        }
        
        progress[topicKey].completed += this.score;
        progress[topicKey].total += this.questions.length;
        
        localStorage.setItem('civilServiceProgress', JSON.stringify(progress));
        this.updateProgressDisplay();
    }

    loadProgress() {
        this.updateProgressDisplay();
    }

    getStoredProgress() {
        const stored = localStorage.getItem('civilServiceProgress');
        return stored ? JSON.parse(stored) : {};
    }

    updateProgressDisplay() {
        const progress = this.getStoredProgress();
        let totalCompleted = 0;
        let totalQuestions = 0;
        
        Object.values(progress).forEach(topic => {
            totalCompleted += topic.completed;
            totalQuestions += topic.total;
        });
        
        const percentage = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;
        
        document.getElementById('overall-progress').style.width = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${percentage}% Complete`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CivilServiceChat();
});