import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

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
                `}
            </style>
            <Carousel className="m-3 carousel-dark">
                {advertisements.map((ad, idx) => (
                    <Carousel.Item key={idx}>
                        <div className={`p-5 d-flex justify-content-center flex-column flex-md-column flex-lg-row ${idx % 2 === 0 ? '' : 'flex-lg-row-reverse'} `}>
                            <div className="col-12 col-lg-1 col-xxl-2" />
                            <div className={`mx-auto my-3 col-8 col-lg-5 col-xxl-4 d-flex justify-content-center align-items-center ${idx % 2 === 0 ? 'justify-content-xl-end me-xl-5' : 'justify-content-xl-start ms-xl-5'}`}>
                                <img
                                    className="img-fluid rounded-circle custom-lg-rounded w-75"
                                    src={ad.src}
                                    alt={`Slide ${idx}`}
                                />
                            </div>
                            <div className={`col-12 col-lg-5 col-xxl-4 d-flex flex-column justify-content-center align-items-start px-3`}>
                                <h3 className="w-100 display-xs-3 display-md-4 display-xl-5 mb-4 text-center text-lg-start" style={{ color: "#b24020" }}>{ad.title}</h3>
                                <p className="fs-xs-3 fs-md-4 fs-xl-5 text-center text-lg-start">{ad.text}</p>
                            </div>
                            <div className="col-12 col-lg-1 col-xxl-2" />
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </>
    );
}

export default AdvertisementCarousel;
