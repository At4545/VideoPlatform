import Button from "../Button/Button";
import Input from "../Input/Input";
import { useForm, Controller } from "react-hook-form";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/DefaultAvatar.jpg";
import defaulCoverImage from "../../assets/DefaultCoverImage.png";
import UploadInput from "../UploadInput/UploadInput";
import { useRef } from "react";
import { useEffect, useState } from "react";
import AuthService from "../../auth/auth";
import axios from "axios";
import { login } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
//add transition clickon next page
//in first name, lastname,password onbluer
// onclick next add focus to tag if there is error in one.

function SignUp() {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    trigger,
    control,
  } = useForm();
  const firstpage = useRef();
  const secondpage = useRef();
  const dispatch= useDispatch();
  const navigate =useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarWatch, coverImageWatch] = watch(["avatar", "coverImage"]);
  const [isEmailExisted, setisEmailExisted] = useState(false)
  const [isUserNameExisted, setisUserNameExisted] = useState(false);

  useEffect(() => {
    if (avatarWatch && avatarWatch?.length > 0) {
      console.log("avatar", avatarWatch[0]);
      const previewUrl = URL.createObjectURL(avatarWatch[0]);
      setAvatar(previewUrl);
    }
    if (coverImageWatch && coverImageWatch?.length > 0) {
      console.log("hello");
      const previewUrl = URL.createObjectURL(coverImageWatch[0]);

      setCoverImage(previewUrl);
    }
  }, [avatarWatch, coverImageWatch]);

  const onNext = async () => {
    const isNotError = await trigger([
      "userName",
      "email",
      "firstName",
      "lastName",
      "password",
    ]);
    if (isNotError && !isEmailExisted && !isUserNameExisted) {
      firstpage.current.classList.add(
        "transition-opacity",
        "duration-1000",
        "opacity-0",
        "invisible"
      );
      firstpage.current.style.display = "none";
      secondpage.current.style.display = "block";
    }
  };
  const validate=async(e)=>{
    if(e.target.name ==="email" && e.target.value){
      const isNotError= await trigger(["email"])
       console.log("checking error",isNotError)
      if(isNotError){
       const flag= await AuthService.checkid({id:e.target.value})
       setisEmailExisted(flag)
      }

    }
    if(e.target.name ==="userName" && e.target.value){
      const isNotError= await trigger(["userName"])
      if(isNotError){
       const flag= await AuthService.checkid({id:e.target.value})
       setisUserNameExisted(flag)
      }
    }

  }

  console.log(isUserNameExisted,isEmailExisted)
  const onSubmit = async(data) => {
    const user = await AuthService.createAccount({...data})
    if(user){
      if(user.status<299){
        console.log(user.data.data)
        //put data into redux toolkit and remove password
        if(user.data.data){
          dispatch(login(user.data.data))
          navigate("/")
        }
       }
       else{
        //can set error
        // seterror("server error")
        window.alert("server Error")
       }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col  justify-center px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={logo} className="mx-auto h-16 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign Up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* form start here  */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* information taking page */}
          <div ref={firstpage}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                UserName
              </label>
              <div className="mt-2">
                <Controller
                  name="userName"
                  control={control}
                  rules={{
                    required: "UserName is required",
                  }}
                  render={({ field }) => (
                    <Input {...field} type="text" name="userName" onBlur={validate}></Input>
                  )}
                />
                {
                  isUserNameExisted? <p className="text-xs text-red-500">
                  This username is already been taken.
                </p>
                :
                errors.userName && (
                  <p className="text-xs text-violet-400">
                    {errors.userName.message}
                  </p>
                )
                }
                {/* {
                errors.userName && (
                  <p className="text-xs text-violet-400">
                    {errors.userName.message}
                  </p>
                )} */}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Regex for email validation
                      message: "Please enter a valid email address", // Custom error message
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} name="email" onBlur={validate}></Input>
                  )}
                />

{
                  isEmailExisted? <p className="text-xs text-red-500">
                  Account with this email has already been creatd.
                </p>
                :
                errors.email &&
                  <p className="text-xs text-violet-400">
                    {errors.email.message}
                  </p>
                
                }

              </div>
            </div>

            <div className="flex gap-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  firstName
                </label>
                <div className="mt-2">
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{
                      required: "This is required",
                      minLength: {
                        value: 1,
                        message: "minimum length should be 1",
                      },
                      maxLength: {
                        value: 15,
                        message: "maximum length should be 1",
                      },
                    }}
                    render={({ field }) => (
                      <Input {...field} name="firstName" onBlur={()=>{trigger(["firstName"])}}></Input>
                    )}
                  />

                  {errors.firstName && (
                    <p className="text-xs text-violet-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="LastName"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  LastName
                </label>
                <div className="mt-2">
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{
                      required: "This is required",
                      minLength: {
                        value: 1,
                        message: "minimum length should be 1",
                      },
                      maxLength: {
                        value: 15,
                        message: "maximum length should be 1",
                      },
                    }}
                    render={({ field }) => (
                      <Input {...field} name="lastName" onBlur={()=>{trigger(["lastName"])}}></Input>
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-violet-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
               
              </div>
              <div className="mt-2">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must be at least 8 characters, contain uppercase, lowercase, number, and special character",
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <Input {...field} type="password" name="password" onBlur={()=>{trigger(["password"])}}></Input>
                    );
                  }}
                />
                {errors.password && (
                  <p className="text-xs text-violet-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              {/*  onClick={onNext} */}
              <Button type="button" onClick={onNext}>
                Next
              </Button>
            </div>
          </div>
          {/* avatar and cover iamge */}
          <div ref={secondpage} className="hidden">
            {/* avartar and cover iamge */}
            <div className="relative max-h-40 max-w-full mb-5 flex-1">
              <img
                src={coverImage || defaulCoverImage}
                className="h-40 w-96 object-cover"
                alt=""
              />
              <img
                className=" absolute top-[70%] left-[40%] inline-block size-20 max rounded-full ring-2 ring-white "
                src={avatar || defaultAvatar}
                alt=""
              />
            </div>
            {/* handling file inputs */}
            <div className="flex gap-3 h-12 pl-3 mt-9">
              <div className="flex-1">
                <UploadInput
                  name="avatar"                 
                  {...register("avatar")}
                ></UploadInput>
              </div>
              <div className="flex-1">
                {/* <UploadInput name="coverImage" {...register("coverImage")}></UploadInput> */}
                <UploadInput
                  name="coverImage"
                  {...register("coverImage")}
                ></UploadInput>
              </div>
            </div>

            <div className="mt-24">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;