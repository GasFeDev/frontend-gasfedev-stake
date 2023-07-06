export const CreateSwalProps = (mainTitle, title) => ({
    title: `<div class="swal-mainTitle">${mainTitle}</div><div class="swal-subTitle">${title}</div>`,
    color: "#ffffff",
    background: "rgba(10, 0, 33, 1)",
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      closeButton: "swal2-close swal-close-button",
      title: "swal-title",
      mainTitle: "swal-mainTitle",
      subTitle: "swal-subTitle",
      popup: "border-white",
    },
  });

export const CreateSwalPropsIspo = (mainTitle, title, confirmButtonText) => ({
    title: `<div class="swal-mainTitle">${mainTitle}</div><div class="swal-subTitle">${title}</div>`,
    color: "#ffffff",
    background: "rgba(10, 0, 33, 1)",
    confirmButtonText,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      closeButton: "swal2-close swal-close-button",
      title: "swal-title",
      mainTitle: "swal-mainTitle",
      subTitle: "swal-subTitle",
      popup: "border-white",
    },
  });  

export const CreateSwalPropsError = (mainTitle, title, confirmButtonText) => ({
    title: `<div class="swal-mainTitle">${mainTitle}</div><div class="swal-subTitle">${title}</div>`,
    color: "#ffffff",
    background: "rgba(10, 0, 33, 1)",
    confirmButtonText,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      closeButton: "swal2-close swal-close-button",
      title: "swal-title",
      mainTitle: "swal-mainTitle",
      subTitle: "swal-subTitle",
      popup: "border-white",
    },
  });