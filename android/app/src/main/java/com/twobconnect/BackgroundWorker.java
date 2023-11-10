public class BackgroundWorker extends Worker {
    private final Context context;

    public BackgroundWorker(
        @NonNull Context context,
        @NonNull WorkerParameters params) {
        super(context, params);
        this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {
        
        // FLAG: BackgroundWorker
        Log.w("bg", "Worker do work");

        Bundle extras = bundleExtras();
        Intent service = new Intent(this.context, TestTaskService.class);
        service.putExtras(extras);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createChannel();
            this.context.startForegroundService(service);
        } else {
            this.context.startService(service);
        }

        return Result.success();
    }
}