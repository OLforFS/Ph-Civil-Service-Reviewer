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
                    "name": "General Knowledge",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Philippine Geography & History",
                            "content": "Key facts about the Philippines:",
                            "points": [
                                "🏙️ **Capital:** Manila (political center)",
                                "🌊 **Geography:** 7,641 islands in Southeast Asia",
                                "👨‍⚕️ **National Hero:** Dr. Jose Rizal",
                                "📅 **Independence:** June 12, 1898 (from Spain)"
                            ],
                            "memory_tip": "💡 **Remember:** Manila = Capital, Rizal = Hero, June 12 = Independence",
                            "example": "📝 **Fun Fact:** Philippines is named after King Philip II of Spain."
                        }
                    ],
                    "questions": [
                        {
                            "id": 1,
                            "question": "What is the capital city of the Philippines?",
                            "type": "multiple-choice",
                            "options": [
                                "Cebu City",
                                "Manila",
                                "Davao City",
                                "Quezon City",
                                "Iloilo City"
                            ],
                            "correct": 1,
                            "explanation": "Manila is the capital city of the Philippines, located on the island of Luzon and serves as the country's political and economic center."
                        }
                    ]
                },
                "mathematics": {
                    "name": "Mathematics",
                    "lessons": [
                        {
                            "id": 1,
                            "title": "Percentage and Ratio Problems",
                            "content": "Master percentage calculations for civil service exams:",
                            "points": [
                                "📊 **Basic Formula:** (Part/Whole) × 100 = Percentage",
                                "🔢 **Finding X% of Y:** (X/100) × Y",
                                "📈 **Percentage Increase:** ((New-Old)/Old) × 100",
                                "📉 **Percentage Decrease:** ((Old-New)/Old) × 100",
                                "⚖️ **Ratio to Percentage:** Ratio a:b = (a/(a+b)) × 100%"
                            ],
                            "memory_tip": "💡 **IS/OF Method:** 'IS' goes over 'OF' - What IS what percent OF what?",
                            "example": "📝 **Budget Problem:** If a department's budget increased from ₱500,000 to ₱650,000, the increase is ((650,000-500,000)/500,000) × 100 = 30%"
                        },
                        {
                            "id": 2,
                            "title": "Number Series and Patterns",
                            "content": "Identify patterns in number sequences:",
                            "points": [
                                "🔢 **Arithmetic Series:** Add/subtract same number (2,4,6,8...)",
                                "📈 **Geometric Series:** Multiply/divide by same number (2,6,18,54...)",
                                "🔄 **Fibonacci Series:** Each number = sum of previous two (1,1,2,3,5,8...)",
                                "🎯 **Square Series:** Perfect squares (1,4,9,16,25...)",
                                "🧮 **Mixed Patterns:** Combination of operations"
                            ],
                            "memory_tip": "💡 **Find the Rule:** Look for +, -, ×, ÷ patterns or special sequences",
                            "example": "📝 **Pattern:** 3,7,11,15,? → Add 4 each time → Answer: 19"
                        },
                        {
                            "id": 3,
                            "title": "Basic Geometry and Measurement",
                            "content": "Essential geometry for practical applications:",
                            "points": [
                                "📐 **Triangle:** Sum of angles = 180°, Area = (base × height)/2",
                                "⭕ **Circle:** Circumference = 2πr, Area = πr²",
                                "📦 **Rectangle:** Area = length × width, Perimeter = 2(l+w)",
                                "📏 **Units:** 1 meter = 100 cm, 1 km = 1000 m",
                                "⏰ **Time:** 1 hour = 60 minutes, 1 day = 24 hours"
                            ],
                            "memory_tip": "💡 **π ≈ 3.14** for quick calculations, exact for word problems",
                            "example": "📝 **Office Space:** A rectangular office 8m × 6m has area = 48 m² and perimeter = 28 m"
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
            this.questions = [...this.data[this.currentTopic].questions];
            this.currentQuestionIndex = 0;
            this.userAnswers = [];
            this.score = 0;

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
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
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
        console.log('showCurrentLesson called - lessons:', this.lessons.length, 'current index:', this.currentLessonIndex); // Debug
        
        if (this.currentLessonIndex >= this.lessons.length) {
            this.finishReviewSession();
            return;
        }

        const lesson = this.lessons[this.currentLessonIndex];
        console.log('Current lesson:', lesson);
        
        // Show lesson title
        this.addMessage('bot', `📚 **${lesson.title}**`);
        
        setTimeout(() => {
            // Show lesson content
            this.addMessage('bot', lesson.content);
        }, 800);

        setTimeout(() => {
            // Show key points
            lesson.points.forEach((point, index) => {
                setTimeout(() => {
                    this.addMessage('bot', point);
                }, (index + 1) * 600);
            });
        }, 1600);

        setTimeout(() => {
            // Show memory tip
            this.addMessage('bot', lesson.memory_tip);
        }, 1600 + (lesson.points.length * 600) + 400);

        setTimeout(() => {
            // Show example
            this.addMessage('bot', lesson.example);
        }, 1600 + (lesson.points.length * 600) + 800);

        setTimeout(() => {
            // Show continue button
            if (this.currentLessonIndex < this.lessons.length - 1) {
                document.getElementById('next-btn').classList.remove('hidden');
                document.getElementById('next-btn').textContent = 'Next Lesson';
            } else {
                document.getElementById('finish-btn').classList.remove('hidden');
                document.getElementById('finish-btn').textContent = 'Finish Review';
            }
        }, 1600 + (lesson.points.length * 600) + 1200);

        this.updateQuestionProgress();
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
        bubble.textContent = text;
        
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