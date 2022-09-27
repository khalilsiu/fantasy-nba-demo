import { useEffect, useRef, useState } from 'react';

export function timeDifference(countDownTime: number) {
    const now = new Date().getTime();
    const distance = countDownTime - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return {
        days,
        hours,
        minutes,
        seconds,
        distance,
    }
}

export function useCountDown({ time, countDown }) {
    const [timerDays, setTimerDays] = useState(0);
    const [timerHours, setTimerHours] = useState(0);
    const [timerMinutes, setTimerMinutes] = useState(0);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [interval, setIntervalState] = useState<NodeJS.Timer | null>(null)

    const startTimer = (countDownTime: number) => {
        setIntervalState(setInterval(() => {
            const {
                days,
                hours,
                minutes,
                seconds,
                distance,
            } = timeDifference(countDownTime)

            if (distance < 0) {
                clearInterval(interval);
            } else {
                setTimerDays(days);
                setTimerHours(hours);
                setTimerMinutes(minutes);
                setTimerSeconds(seconds);
            }
        }, 1000));
    };
    const getTimeDifference = (countDownTime: number) => {
        const {
            days,
            hours,
            minutes,
            seconds,
            distance,
        } = timeDifference(countDownTime)

        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
    };

    useEffect(() => {
        if (countDown) {
            startTimer(time)
            return () => {
                clearInterval(interval)
            }
        } else {
            getTimeDifference(time)
        }
    }, [time])

    return {
        days: timerDays,
        hours: timerHours,
        minutes: timerMinutes,
        seconds: timerSeconds,
    };

}