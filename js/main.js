document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Full 5-Language Cycle Engine (EN -> ES -> FR -> DE -> TR)
    const langBtn = document.getElementById("lang-btn");
    let currentLang = "EN";
    const langs = ["EN", "ES", "FR", "DE", "TR"];

    if (langBtn) {
        langBtn.addEventListener("click", function() {
            let currentIndex = langs.indexOf(currentLang);
            currentLang = langs[(currentIndex + 1) % langs.length];
            
            langBtn.textContent = langs.join(" / ");

            const elementsToTranslate = document.querySelectorAll("[data-en]");
            elementsToTranslate.forEach(el => {
                const translatedText = el.getAttribute(`data-${currentLang.toLowerCase()}`);
                if (translatedText) {
                    el.textContent = translatedText;
                }
            });
        });
        
        langBtn.textContent = langs.join(" / ");
    }

    // 2. Membership Gate & Authentication Engine (Starts on Sign In)
    const protectedPages = ["historias.html", "galeria.html", "hacks.html"];
    const currentPage = window.location.pathname.split("/").pop();
    const memberGateModal = document.getElementById("memberGateModal");
    const navProfileWrapper = document.getElementById("navProfileWrapper");

    const isUserAuthenticated = localStorage.getItem("bohemian_auth_user");

    if (navProfileWrapper) {
        navProfileWrapper.style.display = isUserAuthenticated ? "inline-flex" : "none";
    }

    if (protectedPages.includes(currentPage)) {
        if (!isUserAuthenticated && memberGateModal) {
            memberGateModal.style.display = "flex";
        }
    }

    const memberAuthForm = document.getElementById("memberAuthForm");
    const toggleAuthModeBtn = document.getElementById("toggleAuthModeBtn");
    const gateTitle = document.getElementById("gateTitle");
    const gateSubtitle = document.getElementById("gateSubtitle");
    
    let isLoginMode = true; // Default to Sign In first!

    function renderAuthFields() {
        if (!memberAuthForm) return;
        
        let fieldsHTML = `
            <div class="custom-field" style="text-align: left; margin-bottom: 10px;">
                <label style="font-size: 0.8rem;">Email Address</label>
                <input type="email" id="authEmail" placeholder="e.g. alex@wanderer.com" required style="padding: 8px 12px;">
            </div>
        `;

        if (!isLoginMode) {
            fieldsHTML += `
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <div class="custom-field" style="text-align: left; flex: 1; margin: 0;">
                        <label style="font-size: 0.8rem;">First Name</label>
                        <input type="text" id="authFirstName" placeholder="Alex" required style="padding: 8px 10px;">
                    </div>
                    <div class="custom-field" style="text-align: left; flex: 1; margin: 0;">
                        <label style="font-size: 0.8rem;">Last Name</label>
                        <input type="text" id="authLastName" placeholder="Rivers" required style="padding: 8px 10px;">
                    </div>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <div class="custom-field" style="text-align: left; flex: 1; margin: 0;">
                        <label style="font-size: 0.8rem;">Age</label>
                        <input type="number" id="authAge" placeholder="24" min="18" max="99" required style="padding: 8px 10px;">
                    </div>
                    <div class="custom-field" style="text-align: left; flex: 2; margin: 0;">
                        <label style="font-size: 0.8rem;">Where are you from?</label>
                        <input type="text" id="authLocation" placeholder="Madrid, Spain" required style="padding: 8px 10px;">
                    </div>
                </div>
            `;
        }

        fieldsHTML += `
            <div class="custom-field" style="text-align: left; margin-bottom: 10px;">
                <label style="font-size: 0.8rem;">Password</label>
                <input type="password" id="authPassword" placeholder="••••••••" required style="padding: 8px 12px;">
            </div>
            <div class="captcha-box" style="margin-bottom: 12px; padding: 8px 12px;">
                <label style="font-size: 0.78rem;"><input type="checkbox" id="robotCheck" required> I am not a robot</label>
                <span style="font-size: 0.65rem; color: #94a3b8; font-weight: bold;">reCAPTCHA</span>
            </div>
            <button type="submit" class="btn primary-btn btn-submit-app" style="background-color: var(--burnt-orange); border-color: var(--burnt-orange); padding: 10px; font-size: 0.9rem;">
                ${isLoginMode ? "Sign In & Enter" : "Submit Application & Join"}
            </button>
        `;

        memberAuthForm.innerHTML = fieldsHTML;
    }

    renderAuthFields();

    if (toggleAuthModeBtn) {
        toggleAuthModeBtn.addEventListener("click", function() {
            isLoginMode = !isLoginMode;
            renderAuthFields();

            if (isLoginMode) {
                gateTitle.textContent = "Welcome Back, Wanderer";
                gateSubtitle.textContent = "Sign in to access your community feeds and saved hacks.";
                toggleAuthModeBtn.textContent = "Not a member? Sign up for an account";
            } else {
                gateTitle.textContent = "Join the Inner Crew";
                gateSubtitle.textContent = "Fill out our brief community application to get access to stories and photos and feeds and be a part of this family that is growing more and more each day.";
                toggleAuthModeBtn.textContent = "Already a member? Sign In instead";
            }
        });
    }

    if (memberAuthForm) {
        memberAuthForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("authEmail").value;
            const robotChecked = document.getElementById("robotCheck").checked;

            if (!robotChecked) {
                alert("Please verify you are not a robot.");
                return;
            }

            localStorage.setItem("bohemian_auth_user", email);
            if (memberGateModal) memberGateModal.style.display = "none";
            if (navProfileWrapper) navProfileWrapper.style.display = "inline-flex";
            
            if (!isLoginMode) {
                alert("🎉 Application submitted successfully! Welcome to the growing Bohemian family.");
            }
            window.location.reload();
        });
    }

    // 3. Profile Dashboard & Notifications Modal Logic
    const profileAvatarBtn = document.getElementById("profileAvatarBtn");
    const profileDashboardModal = document.getElementById("profileDashboardModal");
    const closeProfileModal = document.getElementById("closeProfileModal");
    const profileUserEmailDisplay = document.getElementById("profileUserEmailDisplay");
    const signOutBtn = document.getElementById("signOutBtn");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    const clearNotifBtn = document.getElementById("clearNotifBtn");
    const notifDot = document.getElementById("notifDot");
    const notifCountText = document.getElementById("notifCountText");

    if (profileAvatarBtn && profileDashboardModal) {
        profileAvatarBtn.addEventListener("click", function() {
            const userEmail = localStorage.getItem("bohemian_auth_user") || "wanderer@bohemian.com";
            if (profileUserEmailDisplay) profileUserEmailDisplay.textContent = userEmail;
            profileDashboardModal.style.display = "flex";
        });
    }

    if (closeProfileModal) closeProfileModal.addEventListener("click", () => profileDashboardModal.style.display = "none");
    window.addEventListener("click", (e) => {
        if (e.target === profileDashboardModal) profileDashboardModal.style.display = "none";
    });

    if (clearNotifBtn) {
        clearNotifBtn.addEventListener("click", function() {
            if (notifDot) notifDot.style.display = "none";
            if (notifCountText) notifCountText.textContent = "All caught up! No new replies.";
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener("click", function() {
            localStorage.removeItem("bohemian_auth_user");
            alert("Signed out successfully.");
            window.location.href = "index.html";
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to delete your Bohemian account and clear saved data?")) {
                localStorage.removeItem("bohemian_auth_user");
                localStorage.removeItem("bohemian_hacks");
                alert("Account data deleted.");
                window.location.href = "index.html";
            }
        });
    }

    // 4. Interactive Card Deck Engine & Modal (hacks.html)
    const deckModal = document.getElementById("deckModal");
    const closeDeckModal = document.getElementById("closeDeckModal");
    const deckModalTitle = document.getElementById("deckModalTitle");
    const deckModalCategory = document.getElementById("deckModalCategory");
    const deckCardsList = document.getElementById("deckCardsList");

    const deckData = {
        flights: {
            title: "Low-Budget Flight & Multi-City Routing",
            category: "FLIGHT ROUTING",
            cards: [
                {
                    title: "$380 Europe to Queenstown, New Zealand Hack",
                    body: "Instead of booking direct long-haul flights to Queenstown, book a multi-city route landing in Kuala Lumpur or Sydney via AirAsia or Jetstar. Then grab a regional budget flight for the final leg. Use Kiwi.com's 'Nomad' tool on Tuesdays after 2 AM for non-indexed carrier deals.",
                    author: "Kai (@kai_roadseeker)",
                    reply: "Hey, thanks for the tip! Used this exact route and saved $450 on my ticket to NZ!",
                    hostReply: "🌲 BOHEMIAN Host: Amazing Kai! Multi-city stops are key to beating inflated airline algorithms."
                },
                {
                    title: "Connecting flights via Tokyo Narita for $420",
                    body: "Flying into Japan doesn't have to break your budget. Book separate legs using ZIPAIR from North America or Western Europe to Tokyo, then connect with Peach Aviation for regional jumps.",
                    author: "Sora (Osaka)",
                    reply: "Tested this last month—ZIPAIR is so clean and cheap if you carry a lightweight backpack!",
                    hostReply: "🌲 BOHEMIAN Host: Carry-on only is the way to fly cheap. Great call Sora!"
                },
                {
                    title: "Regional Train Hacks across Western Europe",
                    body: "Skip expensive high-speed trains. In Germany/Austria, buy regional night tickets or group pass tickets (like the Deutschland-Ticket) to travel unlimited with 3-4 friends for under $15 each.",
                    author: "Felix (Berlin)",
                    reply: "Thanks for posting this! We split the group pass across four people and saved tons.",
                    hostReply: "🌲 BOHEMIAN Host: Group passes make car-free travel super accessible!"
                }
            ]
        },
        gear: {
            title: "Food, Cooking & Gear Rental Hacks",
            category: "FOOD & GEAR SAVINGS",
            cards: [
                {
                    title: "Never buy new 4-season sleeping bags",
                    body: "If you only do cold alpine trips once a year, rent gear from local mountaineering clubs or buy a thermal fleece bag liner for $15 instead of spending $250 on a heavy zero-degree sleeping bag. It adds +10°C warmth to any standard bag.",
                    author: "Marcus (Stockholm)",
                    reply: "That fleece liner trick saved my life on the Pyrenees trek! Slept super warm.",
                    hostReply: "🌲 BOHEMIAN Host: Fleece liners are lightweight gold. Never overpay for extra bulk!"
                },
                {
                    title: "High-Protein Campfire Meals under $3 per person",
                    body: "Pre-mix dried red lentils, instant couscous, dried vegetable flakes, and smoked paprika in zip-lock bags. All you need is boiling water and 5 minutes over a camp stove for a 700-calorie campfire stew.",
                    author: "Clara (Montreal)",
                    reply: "Tried this stew recipe last weekend—super filling and weighs almost nothing in your pack!",
                    hostReply: "🌲 BOHEMIAN Host: Dehydrated lentil stew is a staple on all our community trips."
                },
                {
                    title: "Thrifting & Secondhand Outdoor Outfits",
                    body: "Buy merino wool base layers and fleece jackets from secondhand stores or Vinted/eBay instead of flagship stores. Brand names don't keep you warm; pure wool and layering do.",
                    author: "Leo (Lyon)",
                    reply: "Got a 100% merino wool sweater for $8 at a thrift shop thanks to this tip!",
                    hostReply: "🌲 BOHEMIAN Host: Function over fashion every single time."
                }
            ]
        },
        campsites: {
            title: "Wild Camping & Free Water Locations",
            category: "FREE CAMPSITES",
            cards: [
                {
                    title: "Secret free water & bivouac spots in Northern Spain",
                    body: "Use the app 'Park4Night' combined with Google Satellite view to spot rural public 'Fuentes' (natural mountain springs) in Asturias. You get clean drinking water and free bivouac spots under starry skies with zero fee.",
                    author: "Lucia (Valencia)",
                    reply: "Hey, thanks for the tip! Found the exact spring near Picos de Europa.",
                    hostReply: "🌲 BOHEMIAN Host: Always respect nature and follow leave-no-trace rules!"
                },
                {
                    title: "Finding Free High-Altitude Bothies in Scotland",
                    body: "The Mountain Bothies Association maintains unlocked shelter cabins across Scotland. They are free to use for any hiker needing a dry place to sleep and cook.",
                    author: "Hamish (Edinburgh)",
                    reply: "Bothy nights are pure magic. Make sure to bring your own dry firewood!",
                    hostReply: "🌲 BOHEMIAN Host: Free mountain shelters are amazing community treasures."
                },
                {
                    title: "Coastal Hammock Spots with Clean River Access",
                    body: "Look for river deltas where freshwater meets the coast on satellite maps. You can camp 100m inland under pine trees, wash off sea salt in fresh river water, and wake up to ocean views.",
                    author: "Mateo (Madrid)",
                    reply: "Did this on the Cantabrian Coast trip! Morning ocean view was unbelievable.",
                    hostReply: "🌲 BOHEMIAN Host: Freshwater rivers near ocean cliffs make the ultimate camp setup."
                }
            ]
        }
    };

    const cardDecks = document.querySelectorAll(".card-deck");
    cardDecks.forEach(deck => {
        deck.addEventListener("click", function() {
            const key = this.getAttribute("data-deck");
            const data = deckData[key];

            if (data && deckModal) {
                if (deckModalCategory) deckModalCategory.textContent = data.category;
                if (deckModalTitle) deckModalTitle.textContent = data.title;
                if (deckCardsList) {
                    deckCardsList.innerHTML = "";
                    data.cards.forEach(c => {
                        const cardEl = document.createElement("div");
                        cardEl.className = "hack-card";
                        cardEl.style.position = "relative";
                        cardEl.innerHTML = `
                            <div>
                                <h3 class="hack-title">${c.title}</h3>
                                <p style="color: #4a5568; font-size: 0.95rem; line-height: 1.5;">"${c.body}"</p>
                            </div>
                            <div class="hack-author">— Submitted by ${c.author}</div>
                            <div class="hack-reply-box">
                                <strong>💬 Community Reply:</strong> "${c.reply}"
                                <div class="hack-reply-host">${c.hostReply}</div>
                            </div>
                        `;
                        deckCardsList.appendChild(cardEl);
                    });
                }
                deckModal.style.display = "flex";
            }
        });
    });

    if (closeDeckModal) closeDeckModal.addEventListener("click", () => deckModal.style.display = "none");

    // 5. Trip & Detailed Gear Breakdown Modal (servicios.html)
    const modal = document.getElementById("tripModal");
    const closeModal = document.querySelector(".close-modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalDetails = document.getElementById("modalDetails");
    const selectedTripKeyInput = document.getElementById("selectedTripKey");
    const appFormWrapper = document.querySelector(".app-form-wrapper");
    const applicationForm = document.getElementById("tripApplicationForm");
    const appSuccessMsg = document.getElementById("applicationSuccessMessage");

    const tripData = {
        pyrenees: {
            title: "Pyrenees Glacial Lakes Expedition",
            desc: "2 Days / 1 Night wild camping trip. Hike past high pine forests to hidden turquoise basin lakes.",
            details: "📍 Location: Huesca Pyrenees | 👥 Group Size: 12 Adventurers | 🎒 Equipment needed: 3-season tent, zero-degree sleeping bag, headlamp, sturdy boots."
        },
        picos: {
            title: "Picos de Europa Sunset Ridge Trek",
            desc: "High altitude day hike across limestone ridges with thermos coffee.",
            details: "📍 Location: Asturias, Spain | 👥 Group Size: 8 Adventurers | 🎒 Equipment needed: Windbreaker jacket, 2L water, trekking poles."
        },
        coast: {
            title: "Cantabrian Coast Kayak & Campfire",
            desc: "3 Days van-life road trip along secret sea caves and beach camping.",
            details: "📍 Location: Cantabria / Basque Coast | 👥 Group Size: 10 Adventurers | 🎒 Equipment needed: Wetsuit/swimwear, dry bag."
        },
        skiing: {
            title: "Alpine Backcountry Skiing & Snowboard Guide",
            logo: "🎿",
            detailedBreakdown: `
                <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.6;">
                    <p><strong>Essential Gear Checklist:</strong></p>
                    <ul style="padding-left: 20px; margin-bottom: 15px;">
                        <li><strong>Touring Skis / Splitboard:</strong> Skis equipped with climbing skins and walk-mode bindings.</li>
                        <li><strong>Avalanche Safety Trio (Beacon, Probe & Shovel):</strong> Non-negotiable safety gear for emergency companion rescue.</li>
                        <li><strong>Thermal Merino Layers:</strong> Synthetic or merino wool base layers that wick sweat.</li>
                    </ul>
                    <p style="background: #fff5f5; border-left: 4px solid #e53e3e; padding: 10px; border-radius: 4px;">
                        ⚠️ <strong>Physical Note:</strong> Strenuous uphill skinning required. Prior experience on groomed slopes is recommended.
                    </p>
                </div>
            `
        },
        climbing: {
            title: "Rock Climbing & Via Ferrata Gear Guide",
            logo: "🧗‍♂️",
            detailedBreakdown: `
                <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.6;">
                    <p><strong>Essential Gear Checklist:</strong></p>
                    <ul style="padding-left: 20px; margin-bottom: 15px;">
                        <li><strong>Climbing Harness:</strong> Rated harness with adjustable leg loops.</li>
                        <li><strong>CE-Certified Helmet:</strong> Protects against potential rockfall.</li>
                        <li><strong>Energy-Absorbing Via Ferrata Lanyard Set:</strong> Features dual auto-locking carabiners.</li>
                    </ul>
                    <p style="background: #fff7ed; border-left: 4px solid var(--burnt-orange); padding: 10px; border-radius: 4px;">
                        🧗 <strong>Safety Warning:</strong> Double-check all knots and carabiner locks before climbing.
                    </p>
                </div>
            `
        },
        cycling: {
            title: "Wilderness Bikepacking Setup",
            logo: "🚲",
            detailedBreakdown: `
                <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.6;">
                    <p><strong>Essential Gear Checklist:</strong></p>
                    <ul style="padding-left: 20px; margin-bottom: 15px;">
                        <li><strong>Hardtail or Gravel Bike:</strong> Outfitted with waterproof seat-packs and frame bags.</li>
                        <li><strong>Navigation & Safety Repair Kit:</strong> Garmin/GPX maps, spare sealant, tire plugs, and first aid kit.</li>
                    </ul>
                    <p style="background: #f0fdf4; border-left: 4px solid var(--pine-green); padding: 10px; border-radius: 4px;">
                        💡 <strong>Body & Joint Note:</strong> Loaded riding puts continuous pressure on knees and lower back. If you have active knee issues, start with shorter rides.
                    </p>
                </div>
            `
        }
    };

    const joinButtons = document.querySelectorAll(".join-btn");
    joinButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const tripKey = this.getAttribute("data-trip");
            const data = tripData[tripKey];

            if (data && modal) {
                if (modalTitle) modalTitle.textContent = data.title;
                if (modalDescription) modalDescription.textContent = data.desc || "";
                if (selectedTripKeyInput) selectedTripKeyInput.value = tripKey;

                if (['skiing', 'climbing', 'cycling'].includes(tripKey)) {
                    if (appFormWrapper) appFormWrapper.style.display = "none";
                    if (modalDetails) {
                        modalDetails.innerHTML = `
                            <div style="text-align: center; font-size: 2.5rem; margin-bottom: 10px;">${data.logo}</div>
                            ${data.detailedBreakdown}
                        `;
                    }
                } else {
                    if (appFormWrapper) appFormWrapper.style.display = "block";
                    if (modalDetails) modalDetails.textContent = data.details;
                }

                if (appSuccessMsg) appSuccessMsg.style.display = "none";
                modal.style.display = "flex";
            }
        });
    });

    if (closeModal) closeModal.addEventListener("click", () => modal.style.display = "none");

    // 6. Full 30-Photo Gallery Renderer (galeria.html)
    const galleryGrid = document.getElementById("galleryGrid");
    
    if (galleryGrid) {
        const galleryPhotos = [
            { src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=600", category: "people", alt: "Marshmallows Campfire", caption: "🔥 Roasting marshmallows over open embers — Pyrenees" },
            { src: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=600", category: "water", alt: "Glacial Cliff Jump", caption: "🌲 Glacial lake cliff jump — Interlaken" },
            { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600", category: "people", alt: "Friends Laughing", caption: "✨ Friends laughing around the campfire — Lofoten" },
            { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600", category: "roadtrip", alt: "Van Sunrise", caption: "🚐 Van roadtrip sunrise coffee" },
            { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600", category: "outdoors", alt: "Alpine Lakes", caption: "🏔️ Morning fog over Alpine lakes — Dolomites" },
            { src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600", category: "night", alt: "Illuminated Tent", caption: "🏕️ Tent illuminated under starry night — Picos de Europa" },
            { src: "https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=600", category: "outdoors", alt: "Forest Trail", caption: "🌲 Deep pine forest trail hike — Black Forest" },
            { src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600", category: "water", alt: "Canoeing Waters", caption: "🚣 Canoeing across emerald waters — Banff" },
            { src: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600", category: "outdoors", alt: "Summit Thermos Tea", caption: "🌄 Reaching the summit with thermos tea — Swiss Alps" },
            { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600", category: "outdoors", alt: "Sunset Ridge Walk", caption: "⛰️ Ridge walking at sunset — Pyrenees" },
            { src: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=600", category: "night", alt: "Lake Fireworks", caption: "🎆 Midnight fireworks over the lake — Solstice camp" },
            { src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=600", category: "outdoors", alt: "Deep Wood Hammock", caption: "🌿 Deep wood hammock setup — Colorado Rockies" },
            { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600", category: "water", alt: "Rowing Fjord", caption: "🛶 Rowing across glassy mountain lake — Norway Fjord" },
            { src: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=600", category: "people", alt: "Outdoor Stew", caption: "🍲 Outdoor stew over open fire — Asturias" },
            { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600", category: "water", alt: "Kayaking River Rapids", caption: "🌊 River kayaking through mountain canyons" },
            { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600", category: "people", alt: "Group Sitting Cliff Edge", caption: "🌅 Sitting on the edge of the world — Cantabria" },
            { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600", category: "night", alt: "Milky Way Camp", caption: "🌌 Milky Way view from the tents — Mount Hood" },
            { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", category: "water", alt: "Beach Guitar Fire", caption: "🏖️ Coastal bonfire & acoustic guitar — Basque Coast" },
            { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600", category: "outdoors", alt: "Misty Trek", caption: "🌫️ Misty morning trek — Pacific Northwest" },
            { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600", category: "roadtrip", alt: "Van Freedom Road", caption: "🚙 Van packed for 4 days of freedom" },
            { src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600", category: "night", alt: "Aurora Night", caption: "✨ Aurora hunting night — Tromsø, Norway" },
            { src: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600", category: "outdoors", alt: "Redwood Forest", caption: "🌲 Breathing in pure oxygen — Redwood Forest" },
            { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600", category: "outdoors", alt: "Lush Valley Trek", caption: "🏞️ Lush valley trek — Ordesa National Park" },
            { src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600", category: "outdoors", alt: "Bikepacking Trail", caption: "🚴 Mountain bikepacking through forest trails" },
            { src: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600", category: "outdoors", alt: "Rock Climbing", caption: "🧗 Rock climbing granite walls — Yosemite" },
            { src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600", category: "outdoors", alt: "Skiing Powder", caption: "🎿 Fresh powder ski touring — Hemsedal" },
            { src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=600", category: "water", alt: "Waterfall Swimming", caption: "💦 Jumping into hidden waterfall pools — Galicia" },
            { src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600", category: "outdoors", alt: "Paragliding Lakes", caption: "🪂 Paragliding over mountain valley lakes" },
            { src: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=600", category: "outdoors", alt: "Campers Lineup", caption: "⛺ Campers lineup — Picos de Europa" },
            { src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600", category: "outdoors", alt: "Cozy Wood Cabin", caption: "🏡 Cozy wood cabin escape — Vermont" }
        ];

        let currentIndex = 0;
        let visiblePhotos = [...galleryPhotos];

        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightboxImg");
        const lightboxCaption = document.getElementById("lightboxCaption");
        const lightboxCounter = document.getElementById("lightboxCounter");
        const lightboxPrev = document.getElementById("lightboxPrev");
        const lightboxNext = document.getElementById("lightboxNext");
        const lightboxClose = document.getElementById("lightboxClose");

        function renderGallery(filter = "all") {
            galleryGrid.innerHTML = "";
            visiblePhotos = filter === "all" ? [...galleryPhotos] : galleryPhotos.filter(p => p.category === filter);

            visiblePhotos.forEach((photo, index) => {
                const item = document.createElement("div");
                item.className = "gallery-item";
                item.innerHTML = `
                    <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
                    <div class="gallery-caption">${photo.caption}</div>
                `;
                item.addEventListener("click", () => {
                    currentIndex = index;
                    showLightbox();
                });
                galleryGrid.appendChild(item);
            });
        }

        function showLightbox() {
            if (!lightbox) return;
            const photo = visiblePhotos[currentIndex];
            lightboxImg.src = photo.src;
            lightboxImg.alt = photo.alt;
            lightboxCaption.textContent = photo.caption;
            lightboxCounter.textContent = `Photo ${currentIndex + 1} of ${visiblePhotos.length}`;
            lightbox.style.display = "flex";
        }

        if (lightboxNext) {
            lightboxNext.addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % visiblePhotos.length;
                showLightbox();
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
                showLightbox();
            });
        }

        if (lightboxClose) lightboxClose.addEventListener("click", () => lightbox.style.display = "none");
        if (lightbox) {
            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) lightbox.style.display = "none";
            });
        }

        const galleryFilters = document.querySelectorAll(".gallery-filter");
        galleryFilters.forEach(button => {
            button.addEventListener("click", function() {
                galleryFilters.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                renderGallery(this.getAttribute("data-filter"));
            });
        });

        renderGallery();
    }

    // 7. User Submitted Hacks Loader
    const userHacksContainer = document.getElementById("userHacksContainer");
    function loadUserSavedHacks() {
        if (!userHacksContainer) return;
        const savedHacks = JSON.parse(localStorage.getItem("bohemian_hacks") || "[]");
        userHacksContainer.innerHTML = "";
        savedHacks.forEach(hack => {
            const card = document.createElement("div");
            card.className = "hack-card";
            card.innerHTML = `
                <div>
                    <span class="hack-tag">USER SUBMISSION</span>
                    <h3 class="hack-title">${hack.title}</h3>
                    <p style="color: #4a5568; font-size: 0.95rem; line-height: 1.5;">"${hack.detail}"</p>
                </div>
                <div class="hack-author">— Submitted by ${hack.author}</div>
                <div class="hack-reply-box">
                    <strong>💬 Community Reply:</strong> "Hey, thanks for the tip! Adding this to our next trip itinerary."
                </div>
            `;
            userHacksContainer.prepend(card);
        });
    }
    loadUserSavedHacks();

    // 8. Forms & Submissions
    const ideaForm = document.getElementById("ideaForm");
    if (ideaForm) {
        ideaForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const author = document.getElementById("hackAuthor").value;
            const title = document.getElementById("hackTitle").value;
            const detail = document.getElementById("hackDetail").value;

            const newHack = { author, title, detail };
            const savedHacks = JSON.parse(localStorage.getItem("bohemian_hacks") || "[]");
            savedHacks.push(newHack);
            localStorage.setItem("bohemian_hacks", JSON.stringify(savedHacks));

            const msg = document.getElementById("ideaSuccessMessage");
            if (msg) msg.style.display = "block";
            ideaForm.reset();
        });
    }

    if (applicationForm) {
        applicationForm.addEventListener("submit", function(e) {
            e.preventDefault();
            if (appSuccessMsg) appSuccessMsg.style.display = "block";
            applicationForm.reset();
        });
    }

    const storyForm = document.getElementById("storyForm");
    if (storyForm) {
        storyForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const msg = document.getElementById("formSuccessMessage");
            if (msg) msg.style.display = "block";
            storyForm.reset();
        });
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const msg = document.getElementById("contactSuccessMessage");
            if (msg) msg.style.display = "block";
            contactForm.reset();
        });
    }

    // 9. Back-To-Top Floating Button
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 10. Radio Sidebar Drawer Engine
    const radioTabBtn = document.getElementById("radioTabBtn");
    const radioDrawer = document.getElementById("radioDrawer");
    const closeRadioBtn = document.getElementById("closeRadioBtn");
    const bohemianAudio = document.getElementById("bohemianAudio");
    const playRadioBtn = document.getElementById("playRadioBtn");

    if (radioTabBtn && radioDrawer) {
        radioTabBtn.addEventListener("click", () => radioDrawer.classList.toggle("open"));
        if (closeRadioBtn) closeRadioBtn.addEventListener("click", () => radioDrawer.classList.remove("open"));
    }

    if (playRadioBtn && bohemianAudio) {
        playRadioBtn.addEventListener("click", function() {
            if (bohemianAudio.paused) {
                bohemianAudio.play();
                playRadioBtn.textContent = "⏸️ Pause Radio";
                playRadioBtn.style.backgroundColor = "var(--pine-green)";
            } else {
                bohemianAudio.pause();
                playRadioBtn.textContent = "▶️ Play Chill Radio";
                playRadioBtn.style.backgroundColor = "var(--burnt-orange)";
            }
        });
    }
});