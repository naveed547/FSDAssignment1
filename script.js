"use strict";

jQuery.noConflict();

(function ($) {
    $(document).ready(function () {

        var gitObj = {
            issueId: '',
            init: function() {
                this.myForm = $("form[name='repoSearch']");
                this.cForm = $("form[name='createIssue']");
                this.inputField = $("#userName");
                this.loader = $(".loader");
                this.repoList = $(".repo-list");
                this.errMsg = $(".no-repo"); 
                this.repoName = $("#repoName");
                this.repoDesc = $("#repoDesc");
                this.issueSuccess = $("#issueSuccess");
                this.repoId = $("#repoId");

                this.bindEvents();
            },
            toggleEnable: function(evt) {
                var getFormButton = $(this).closest("form").find("[type=submit]");
                this.value !='' ? getFormButton.removeAttr("disabled") : getFormButton.attr("disabled","disabled"); 
            },
            closeAlert: function() {
                this.issueSuccess.removeClass("show in");
            },
            openAlert: function() {
                this.issueSuccess.addClass("show in");
            },
            bindEvents: function() {
                this.cForm.keyup(this.toggleEnable);
                this.inputField.keyup(this.toggleEnable);
                /* $("body").click(function(e){
                    if(!($(e.target).closest(".alert").length || $(e.target).hasClass("alert")) && gitObj.issueSuccess.hasClass('show')) gitObj.closeAlert();
                }) */
                this.myForm.submit(function (evt) {
                    evt.preventDefault();
                    //show loader  
                    var _this = gitObj;
                    _this.loader.show();
                    $.ajax({
                        url: "https://api.github.com/users/"+_this.inputField.val()+"/repos", 
                        success: function(result){
                            
                            _this.loader.hide(); 
                            var resultLi=''; 
                            _this.repoList.html("");
                            _this.errMsg.hide();
                            if(result.length > 0) {
                                for(var i=0;i<result.length;i++) {
                                    resultLi +='<li class="list-group-item"><a href data-href="#issuePopup">'+result[i].name+'</a></li>'
                                }
                                _this.repoList.html(resultLi);
                            }else {
                                _this.errMsg.show();
                            }
                        },
                        error: function(err) {
                            _this.loader.hide(); 
                            _this.errMsg.show();
                        }
                    });          
                });
                this.cForm.find("button[type='submit']").click(function (evt) {
                    evt.preventDefault();
                    var myForm = $(this).closest("form");
                    //gitObj.openAlert();
                    //removing access token for security reason
                    $.ajax({
                        url: "https://api.github.com/repos/" + gitObj.inputField.val() + "/" + gitObj.repoName.val() + "/issues?access_token=XXXXXXXX",
                        type: "POST",
                        data: JSON.stringify({
                          title: myForm[0].repotitle.value, 
                          body: myForm[0].repodesc.value
                        }),
                        success: function(data) {
                            gitObj.repoId.text(gitObj.repoName.val() + " with id:#" + data.id);
                            gitObj.openAlert();
                            gitObj.issueId='';
                        },
                        error: function(err) {
                            alert("Error in form");
                            console.log(err);
                        }
                    })
                });
                this.repoList.on("click","a",function(evt){
                    evt.preventDefault();
                    gitObj.issueId = $(this).text();
                    gitObj.cForm[0].reset()
                    $(this.dataset.href).modal("show");
                    gitObj.repoName.val(gitObj.issueId);
                });
                gitObj.issueSuccess.find(".close").click(function(){
                    gitObj.closeAlert();
                })
            },
        }
        gitObj.init();

    });
})(jQuery);
