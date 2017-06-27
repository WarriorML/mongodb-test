$('form').submit(function (ev) {
    ev.preventDefault()
    $.post(
        $(this).attr('action'),
        $(this).serialize(),
        function (data) {
            if (data.code == 'success') {
                location.href = '/'
            } else {
                alert('添加用户失败')
            }
        }
    )
})