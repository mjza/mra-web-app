import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Carousel } from 'react-bootstrap';

function AdvertisementCarousel() {
    const advertisements = [
        {
            src: "images/banner1.webp",
            title: "Empower Your Community",
            text: "Spot issues? Report instantly with MyReportApp! Whether it's damage in your neighborhood, suggestions for the advancement of a city, organizational flaws, or service complaints, share them privately with facility managers or publicly with the RC community. Your voice matters. Let's make it heard."
        },
        
        {
            src: "/images/banner2.webp",
            title: "Engage With Organizations",
            text: "Take action in your community with MyReportApp. Vote on local issues, track their resolution, and stay informed by simply scanning QR codes on issue announcements. Your involvement can drive change. Start by keeping updated on the progress of reports in your neighborhood."
        },
        {
            src: "/images/banner3.webp",
            title: "Enhance Citizen Satisfaction",
            text: "MyReportApp is designed with happiness in mind. As a smart city solution, it not only facilitates efficient issue reporting and monitoring but also rewards engaged citizens with perks from local institutions. Report, monitor, and get rewarded. Join our community of responsible citizens."
        },
        {
            src: "/images/banner4.webp",
            title: "Stay Updated Locally",
            text: "Keep your finger on the pulse of your city with MyReportApp. More than just a report management tool, our app supports local businesses by offering a platform for eco-friendly and digital advertising. Stay informed and engaged with everything happening around you."
        },
    ];

    return (
        <>
            <style>
                {`
                    @media (min-width: 992px) {  /* Bootstrap 'lg' breakpoint */
                        .custom-lg-rounded {
                        border-radius: 0.3rem !important;  /* mimics Bootstrap's .rounded-5 */
                        }
                    }
                    /* Dark theme styles */
                    [data-bs-theme="dark"] .carousel .carousel-control-next-icon,
                    [data-bs-theme="dark"] .carousel .carousel-control-prev-icon {
                        filter: invert(0) grayscale(100%);
                    }

                    /* Light theme styles */
                    [data-bs-theme="light"] .carousel .carousel-control-next-icon,
                    [data-bs-theme="light"] .carousel .carousel-control-prev-icon {
                        filter: invert(1); 
                    }

                    /* Ensure indicators are visible against any theme */
                    [data-bs-theme="light"] .carousel .carousel-indicators [data-bs-target],
                    [data-bs-theme="dark"] .carousel .carousel-indicators [data-bs-target] {
                        background-color: currentColor; 
                    }

                `}
            </style>
            <Carousel className={`m-3`}>
                {advertisements.map((ad, idx) => (
                    <Carousel.Item key={idx}>
                        <div className='d-flex flex-column justify-content-center'>
                            <h3 className="w-100 pt-5 pb-2 d-block d-xl-none display-xs-5 display-md-4 display-lg-4 text-center" style={{ color: "#b24020" }}>{ad.title}</h3>
                            <div className={`p-xs-1 p-xl-5 d-flex justify-content-center flex-column flex-md-column flex-lg-row ${idx % 2 === 0 ? '' : 'flex-lg-row-reverse'} `}>
                                <div className="col-12 col-lg-1 col-xxl-2" />
                                <div className={`mx-auto my-3 col-8 col-lg-5 col-xxl-4 d-flex justify-content-center align-items-center align-items-lg-start ${idx % 2 === 0 ? 'justify-content-lg-end ms-xl-5' : 'justify-content-lg-start me-xl-5'}`}>
                                    <img
                                        className="img-fluid rounded-circle custom-lg-rounded w-75"
                                        src={ad.src}
                                        alt={`Slide ${idx}`}
                                    />
                                </div>
                                <div className={`col-12 col-lg-5 col-xxl-4 d-flex flex-column justify-content-start align-items-center px-3 ${idx % 2 === 0 ? 'me-xl-5' : 'ms-xl-5'}`}>
                                    <div className={`mb-5 mb-lg-3 mb-xl-0 ${idx % 2 === 0 ? 'pe-lg-5 me-lg-5' : 'ps-lg-5 ms-lg-5'}`}>
                                        <h3 className="w-100 d-none d-xl-block display-xl-5 mb-4 text-center text-xl-start" style={{ color: "#b24020" }}>{ad.title}</h3>
                                        <p className="fs-xs-3 fs-md-4 fs-xl-5 text-center text-lg-start">{ad.text}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-1 col-xxl-2" />
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </>
    );
}

export default AdvertisementCarousel;
