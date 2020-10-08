import Swal from 'sweetalert2'
export const Alert = (title, text, type) => {
	return (
		Swal.fire({
            title: title,
            text: text,
            type: type,
            confirmButtonText: 'OK'
          })
	)
}