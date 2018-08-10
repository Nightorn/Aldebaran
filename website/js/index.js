const root = "http://nightorn.com:3000";
const site = "/api/v1/aldebaran/stats/servers";


$.get(root+site)
.done(function(data) {
    $("#servercount").html(data);
})
.fail(function(xhr, status, err) {
    console.error(err);
    $("#servercountview").html("Failed to load server count. Check console for more details. Report this!!")
})