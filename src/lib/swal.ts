import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Standard App Notification Alert (with Anton font for title)
export const AppSwal = MySwal.mixin({
  customClass: {
    title: 'font-heading tracking-wide uppercase', 
  }
});

// Toast Notification for quick unobtrusive messages
export const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export default AppSwal;
