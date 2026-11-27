import {onCall,HttpsError} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore,FieldValue} from "firebase-admin/firestore";
initializeApp();
const db=getFirestore();
function cleanUsername(value:string){return value.toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9.]/g,"").replace(/^\\.+|\\.+$/g,"");}
async function requireManager(uid:string|undefined){if(!uid)throw new HttpsError("unauthenticated","Please sign in.");const snap=await db.doc("users/"+uid).get();const p=snap.data();if(!p||p.active!==true||!["admin","manager","assessor"].includes(p.role))throw new HttpsError("permission-denied","Manager access is required.");return p;}
const loginDomain="drivers.academy.swansapps.co.uk";
export const createDriverAccount=onCall(async request=>{
 const manager=await requireManager(request.auth?.uid);
 const {driverId,temporaryPassword}=request.data||{};
 if(typeof driverId!=="string"||typeof temporaryPassword!=="string"||temporaryPassword.length<10)throw new HttpsError("invalid-argument","Choose a temporary password of at least 10 characters.");
 const ref=db.doc("drivers/"+driverId);const snap=await ref.get();if(!snap.exists)throw new HttpsError("not-found","Driver not found in the register.");
 const driver=snap.data()!;if(driver.authUid)throw new HttpsError("already-exists","This driver already has a login.");
 const username=cleanUsername(driver.username||driver.id);if(!username)throw new HttpsError("invalid-argument","A valid username could not be generated.");
 const email=username+"@"+loginDomain;
 let user;try{user=await getAuth().createUser({email,password:temporaryPassword,displayName:driver.name,disabled:!driver.active});}catch(e:any){if(e.code==="auth/email-already-exists")throw new HttpsError("already-exists","That username is already in use. Change the username in the driver register.");throw new HttpsError("internal",e.message||"Could not create driver login.");}
 const batch=db.batch();batch.set(db.doc("users/"+user.uid),{uid:user.uid,driverId,name:driver.name,username,email,depot:driver.depot,role:"driver",active:driver.active===true,mustChangePassword:true,createdAt:FieldValue.serverTimestamp(),createdBy:request.auth!.uid});batch.update(ref,{authUid:user.uid,username,accountCreatedAt:FieldValue.serverTimestamp(),accountCreatedBy:request.auth!.uid});batch.set(db.collection("auditLog").doc(),{action:"driver_account_created",driverId,driverName:driver.name,username,createdBy:request.auth!.uid,createdAt:FieldValue.serverTimestamp()});await batch.commit();return {uid:user.uid,username};
});
export const resetDriverPassword=onCall(async request=>{
 await requireManager(request.auth?.uid);const {uid,temporaryPassword}=request.data||{};if(typeof uid!=="string"||typeof temporaryPassword!=="string"||temporaryPassword.length<10)throw new HttpsError("invalid-argument","Choose a password of at least 10 characters.");
 const snap=await db.doc("users/"+uid).get();if(!snap.exists||snap.data()?.role!=="driver")throw new HttpsError("not-found","Driver account not found.");
 await getAuth().updateUser(uid,{password:temporaryPassword});await db.doc("users/"+uid).update({mustChangePassword:true,passwordResetAt:FieldValue.serverTimestamp()});await db.collection("auditLog").add({action:"driver_password_reset",driverUid:uid,createdBy:request.auth!.uid,createdAt:FieldValue.serverTimestamp()});return {success:true};
});
