document.addEventListener('DOMContentLoaded', () => {

    // --- Animate on Scroll Initialization ---
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true, // whether animation should happen only once - while scrolling down
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Interactive Application Explorer Logic ---
    const explorerData = {
        'Automotive': {
            baseVideo: 'videos/Base_video_prompt_202507221132_b61t8.mp4',
            hotspots: [
                {
                    title: 'Body Panels & Chassis',
                    description: 'Self-piercing rivets are used to join dissimilar materials like aluminum and high-strength steel, providing a strong, lightweight bond crucial for modern vehicle safety and fuel efficiency.',
                    rivetType: 'Self-Piercing Rivets',
                    highlightVideo: 'videos/For_body_panels_202507221139_8mf9b.mp4',
                    position: { top: '55%', left: '50%' }
                }
            ]
        },
        'Aerospace': {
            baseVideo: 'videos/A_photorealistic_4k_202507221148_byb5m.mp4',
            hotspots: [
                {
                    title: 'Fuselage Structure',
                    description: 'High-strength titanium and aluminum alloy rivets are essential for assembling the aircraft fuselage, ensuring structural integrity under extreme stress and pressure variations at high altitudes.',
                    rivetType: 'Solid Shank Titanium Rivets',
                    highlightVideo: 'videos/For_fuselage_structure_202507221151_8x6t3.mp4',
                    position: { top: '50%', left: '60%' }
                }
            ]
        },
        'Construction': {
            baseVideo: 'videos/Base_video_prompt_202507221132_2k1zn.mp4',
            hotspots: [
                {
                    title: 'Steel Truss Bridges',
                    description: 'Large-diameter structural steel rivets are used to connect beams and trusses in bridges, offering unparalleled shear strength and durability against environmental factors and heavy loads.',
                    rivetType: 'Structural Steel Rivets (ASTM A502)',
                    highlightVideo: 'videos/For_steel_truss_202507221857.mp4',
                    position: { top: '60%', left: '45%' }
                }
            ]
        },
        'Shipbuilding': {
            baseVideo: 'videos/A_majestic_sweeping_202507221908.mp4',
            hotspots: [
                 {
                    title: 'Hull Plating',
                    description: 'Watertight rivets are critical for joining the steel plates of a ship\'s hull, providing a strong and corrosion-resistant seal that maintains the vessel\'s integrity in harsh marine environments.',
                    rivetType: 'Marine-Grade Steel Rivets',
                    highlightVideo: 'videos/A_majestic_sweeping_202507221908.mp4', // Placeholder: Replays base video
                    position: { top: '65%', left: '50%' }
                }
            ]
        }
    };

    const tabs = document.querySelectorAll('.tab-link');
    const videoPlayer = document.getElementById('industry-video-player');
    const videoSource = videoPlayer.querySelector('source');
    const hotspotsContainer = document.getElementById('hotspots-container');
    const infoPanel = document.getElementById('info-panel');
    const infoPanelCloseBtn = document.getElementById('info-panel-close');
    const infoPanelTitle = document.getElementById('info-panel-title');
    const infoPanelDescription = document.getElementById('info-panel-description');
    const infoPanelRivetType = document.getElementById('info-panel-rivet-type');

    let currentIndustry = 'Automotive';

    function updateExplorer(industryName) {
        currentIndustry = industryName;
        const industryData = explorerData[industryName];
        if (!industryData) return;

        videoSource.src = industryData.baseVideo;
        videoPlayer.load();
        videoPlayer.loop = true;
        videoPlayer.play();

        hotspotsContainer.innerHTML = '';
        industryData.hotspots.forEach((hotspotData, index) => {
            const hotspotElement = document.createElement('div');
            hotspotElement.className = 'hotspot';
            hotspotElement.style.top = hotspotData.position.top;
            hotspotElement.style.left = hotspotData.position.left;
            hotspotElement.dataset.index = index;
            hotspotsContainer.appendChild(hotspotElement);
        });
        infoPanel.classList.remove('visible');
    }

    function onHotspotClick(e) {
        if (!e.target.classList.contains('hotspot')) return;
        const hotspotIndex = e.target.dataset.index;
        const hotspotData = explorerData[currentIndustry].hotspots[hotspotIndex];
        if (!hotspotData) return;

        videoSource.src = hotspotData.highlightVideo;
        videoPlayer.load();
        videoPlayer.loop = false;
        videoPlayer.play();

        infoPanelTitle.textContent = hotspotData.title;
        infoPanelDescription.textContent = hotspotData.description;
        infoPanelRivetType.textContent = hotspotData.rivetType;
        infoPanel.classList.add('visible');
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const industryName = tab.dataset.industry;
            updateExplorer(industryName);
        });
    });

    hotspotsContainer.addEventListener('click', onHotspotClick);

    videoPlayer.addEventListener('ended', () => {
        if (!videoPlayer.loop) {
            const industryData = explorerData[currentIndustry];
            videoSource.src = industryData.baseVideo;
            videoPlayer.load();
            videoPlayer.loop = true;
            videoPlayer.play();
        }
    });

    infoPanelCloseBtn.addEventListener('click', () => {
        infoPanel.classList.remove('visible');
    });

    updateExplorer(currentIndustry);

    // --- Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    counters.forEach(counter => {
        observer.observe(counter);
    });


    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
