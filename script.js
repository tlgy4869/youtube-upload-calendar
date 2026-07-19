// ============================
// 현재 표시 중인 달
// ============================

let currentYear = 2026;
let currentMonth = 7;



// ============================
// 테스트 업로드 데이터
// (나중에 YouTube API로 교체)
// ============================

// ============================
// 테스트 업로드 데이터
// (RSS 연결 전 테스트용)
// ============================

let uploads = [];



// ============================
// YouTube RSS 테스트
// ============================

const channelId =
    "UCbOPUOzzwKgG8uTawmDHdWA";

const apiUrl =
    "https://script.google.com/macros/s/AKfycbwm9o8mO0wHvoITO3YAh_g4RdeMoHoNZmU8_tqerZTu6aHbdx5bzJheZ3jX0tMxRuaL/exec";


async function loadUploads() {

    try {

        const response =
            await fetch(
                apiUrl
            );


        const data =
            await response.json();



        uploads = data.map(video => {


            return {

                id:
                    video.id,


                date:
                    video.date,


                time:
                    video.time,


                title:
                    video.title,


                duration:
                    video.duration,


                autoType:
                    video.type,


                type:
                    video.type

            };


        });



        console.log(uploads);



        renderCalendar();

        updateStats();



    } catch (error) {


        console.error(
            "업로드 불러오기 실패",
            error
        );


    }

}


function updateStats() {


    const monthlyUploads =
        uploads.filter(
            upload => {


                const [year, month] =
                    upload.date.split("-");



                return (
                    Number(year) === currentYear &&
                    Number(month) === currentMonth
                );


            }
        );



    const total =
        monthlyUploads.length;



    const videoCount =
        monthlyUploads.filter(
            upload =>
                upload.type === "video"
        ).length;



    const shortsCount =
        monthlyUploads.filter(
            upload =>
                upload.type === "shorts"
        ).length;



    document
        .getElementById("total-count")
        .textContent =
        `${total} (전체 ${uploads.length})`;



    document
        .getElementById("video-count")
        .textContent =
        videoCount;



    document
        .getElementById("shorts-count")
        .textContent =
        shortsCount;


}



// ============================
// HTML 연결
// ============================

const calendarDays =
    document.getElementById("calendar-days");


const calendarTitle =
    document.getElementById("calendar-title");


const prevButton =
    document.getElementById("prev-month");


const nextButton =
    document.getElementById("next-month");





// ============================
// 달력 생성
// ============================

function renderCalendar() {


    if (!calendarDays) {

        console.error("calendar-days 없음");

        return;

    }



    calendarDays.innerHTML = "";



    calendarTitle.textContent =
        `${currentYear}년 ${currentMonth}월`;





    const firstDay =
        new Date(
            currentYear,
            currentMonth - 1,
            1
        ).getDay();



    const lastDate =
        new Date(
            currentYear,
            currentMonth,
            0
        ).getDate();



    const prevLastDate =
        new Date(
            currentYear,
            currentMonth - 1,
            0
        ).getDate();





    const totalCells =
        Math.ceil(
            (firstDay + lastDate) / 7
        ) * 7;





    for (
        let i = 0;
        i < totalCells;
        i++
    ) {



        const day =
            document.createElement("div");


        day.classList.add("day");



        let dateNumber;



        // 이전 달

        if (i < firstDay) {


            dateNumber =
                prevLastDate - firstDay + i + 1;


            day.classList.add(
                "other-month"
            );


        }



        // 다음 달

        else if (
            i >= firstDay + lastDate
        ) {


            dateNumber =
                i - firstDay - lastDate + 1;


            day.classList.add(
                "other-month"
            );


        }



        // 현재 달

        else {


            dateNumber =
                i - firstDay + 1;


        }





        const date =
            document.createElement("span");


        date.classList.add("date");


        date.textContent =
            dateNumber;



        day.appendChild(date);





        // ========================
        // 업로드 원 표시
        // ========================


        if (
            !day.classList.contains("other-month")
        ) {


            const currentDate =
                `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(dateNumber).padStart(2, "0")}`;



            const todayUploads =
                uploads.filter(
                    upload =>
                        upload.date === currentDate
                );

            todayUploads.sort((a, b) =>
                a.time.localeCompare(b.time)
            );


            if (todayUploads.length > 0) {



                const uploadDots =
                    document.createElement("div");


                uploadDots.classList.add(
                    "upload-dots"
                );




                todayUploads.forEach(
                    upload => {


                        const dot =
                            document.createElement("span");


                        dot.classList.add(
                            "dot"
                        );



                        if (upload.type === "video") {


                            dot.classList.add(
                                "video"
                            );


                        }



                        if (upload.type === "shorts") {


                            dot.classList.add(
                                "shorts"
                            );


                        }



                        uploadDots.appendChild(dot);


                    }
                );



                day.appendChild(uploadDots);


            }


        }



        // 날짜 칸 클릭 이벤트

        day.onclick = function () {


            const clickedDate =
                `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(dateNumber).padStart(2, "0")}`;



            const selectedUploads =
                uploads.filter(
                    upload =>
                        upload.date === clickedDate
                );

            console.log(clickedDate);
            console.log(selectedUploads);


            if (selectedUploads.length === 0) {

                return;

            }



            openPopup(
                clickedDate,
                selectedUploads
            );


        };



        calendarDays.appendChild(day);


    }


}






// ============================
// 이전 달
// ============================


prevButton.addEventListener(
    "click",
    function () {


        currentMonth--;


        if (currentMonth < 1) {


            currentMonth = 12;

            currentYear--;


        }



        renderCalendar();
        updateStats();


    }
);






// ============================
// 다음 달
// ============================


nextButton.addEventListener(
    "click",
    function () {


        currentMonth++;


        if (currentMonth > 12) {


            currentMonth = 1;

            currentYear++;


        }



        renderCalendar();
        updateStats();

    }
);



// =================================
// 팝업 요소
// =================================

const popupOverlay = document.getElementById("popup-overlay");

const popupClose = document.getElementById("popup-close");

const popupTitle = document.getElementById("popup-title");





// =================================
// 팝업 열기
// =================================

function openPopup(date, data) {

    const popupContent =
        document.getElementById("popup-content");


    document.getElementById("popup-title").textContent =
        `${date} 업로드`;



    document.getElementById("popup-content").innerHTML = "";


    data.sort((a, b) => {

        return a.time.localeCompare(b.time);

    });


    data.forEach(upload => {


        const item = document.createElement("div");

        item.className = "popup-item";



        const typeClass =
            upload.type === "video"
                ? "video"
                : "shorts";



        item.innerHTML = `

    <div class="popup-info">

        <span class="popup-dot ${typeClass}"></span>

        <span class="popup-time">
            ${upload.time}
        </span>

    </div>


    <div class="popup-video-title">
        ${upload.title}
    </div>

`;



        popupContent.appendChild(item);


    });



    popupOverlay.classList.add("active");


}



// =================================
// 팝업 닫기
// =================================

function closePopup() {


    popupOverlay.classList.remove("active");


}



// =================================
// 닫기 버튼 이벤트
// =================================

if (popupClose) {

    popupClose.addEventListener(
        "click",
        closePopup
    );

}



// =================================
// 팝업 바깥 클릭 시 닫기
// =================================

if (popupOverlay) {

    popupOverlay.addEventListener(
        "click",
        function (event) {

            if (event.target === popupOverlay) {

                closePopup();

            }

        }
    );

}



// =================================
// 최초 실행
// =================================

renderCalendar();


loadUploads();